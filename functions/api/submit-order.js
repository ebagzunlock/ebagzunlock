export async function onRequestPost({ request, env }) {
  try {
    if (!env.STRIPE_SECRET_KEY || !env.RESEND_API_KEY) {
      return Response.json({ error: "Configuration serveur manquante." }, { status: 500 });
    }

    const { sessionId } = await request.json();
    if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      return Response.json({ error: "Référence de paiement invalide." }, { status: 400 });
    }

    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand%5B%5D=invoice`,
      { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } }
    );
    const session = await stripeResponse.json();

    if (!stripeResponse.ok || session.payment_status !== "paid" || session.status !== "complete") {
      return Response.json({ error: "Paiement non confirmé. Commande non envoyée." }, { status: 403 });
    }

    const meta = session.metadata || {};
    const service = meta.service || "";
    const device = meta.device || "";
    const model = meta.model || "";
    const amount = meta.amount_eur || "";
    const name = meta.customer_name || "";
    const email = meta.customer_email || session.customer_details?.email || "";
    const phone = meta.customer_phone || "";
    const identifier = meta.customer_identifier || "";
    const message = meta.customer_message || "";

    const independent = device === "ebagzunlock ";
    if (!service || !device || (!model && !independent) || !name || !email || !phone || (!identifier && !independent)) {
      return Response.json({ error: "Les informations de commande sont incomplètes." }, { status: 400 });
    }

    let invoice = session.invoice;
    if (typeof invoice === "string") {
      const invoiceResponse = await fetch(`https://api.stripe.com/v1/invoices/${encodeURIComponent(invoice)}`, {
        headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` }
      });
      invoice = await invoiceResponse.json();
      if (!invoiceResponse.ok) throw new Error("Impossible de récupérer la facture Stripe.");
    }

    const invoicePdf = invoice?.invoice_pdf || "";
    const invoiceUrl = invoice?.hosted_invoice_url || "";
    if (!invoicePdf && !invoiceUrl) {
      return Response.json({ error: "Le paiement est confirmé, mais la facture Stripe n'est pas encore disponible. Réessayez dans quelques instants." }, { status: 503 });
    }

    const orderDetails = [
      `Service : ${service}`, `Option / appareil : ${device}`,
      ...(model ? [`Modèle : ${model}`] : []),
      `Montant : ${amount} €`,
      `Référence Stripe : ${sessionId}`, `Facture : ${invoicePdf || invoiceUrl}`,
      `Nom : ${name}`, `E-mail : ${email}`, `Téléphone : ${phone}`,
      ...(identifier ? [`IMEI / numéro de série : ${identifier}`] : []),
      `Informations complémentaires : ${message || "Aucune"}`
    ];
    const orderText = ["NOUVELLE COMMANDE PAYÉE — EBAGZUNLOCK", "", ...orderDetails].join("\n");

    const sendEmail = async (payload, key) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const detail = await response.text();
        console.error("Resend error:", detail);
        throw new Error("L'envoi automatique d'un e-mail a échoué.");
      }
    };

    await sendEmail({
      from: "ebagzunlock <commandes@ebagzunlock.com>",
      to: ["ebagzunlock@outlook.fr"],
      reply_to: email,
      subject: `Nouvelle commande payée — ${model || device}`,
      text: orderText
    }, `commande-admin-${sessionId}`);

    const invoiceLink = invoicePdf || invoiceUrl;
    await sendEmail({
      from: "ebagzunlock <commandes@ebagzunlock.com>",
      to: [email],
      subject: "Votre facture — EBAGZUNLOCK",
      text: [
        `Bonjour ${name},`, "",
        "Nous confirmons la réception de votre paiement et de votre commande.",
        `Prestation : ${service}`, `Appareil / option : ${device}`, ...(model ? [`Modèle : ${model}`] : []), `Montant réglé : ${amount} €`, "",
        "Votre facture est disponible ici :", invoiceLink, "",
        "Merci pour votre confiance.", "EBAGZUNLOCK"
      ].join("\n")
    }, `facture-client-${sessionId}`);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Erreur commande :", error);
    return Response.json({ error: error.message || "Erreur lors de l'envoi de la commande." }, { status: 502 });
  }
}
