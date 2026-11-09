export async function onRequestPost({ request, env }) {
  try {
    if (!env.STRIPE_SECRET_KEY || !env.RESEND_API_KEY) {
      return Response.json({ error: "Configuration serveur manquante." }, { status: 500 });
    }

    const { sessionId } = await request.json();
    if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      return Response.json({ error: "Référence de paiement invalide." }, { status: 400 });
    }

    // La confirmation repose uniquement sur le paiement Stripe réellement reçu.
    // La facture envoyée au client est notre facture ebagzunlock, pas un lien Stripe.
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
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
    const amount = Number(session.amount_total ?? (Number(meta.amount_eur || 0) * 100));
    const amountText = (amount / 100).toFixed(2).replace(".", ",");
    const name = meta.customer_name || "";
    const email = meta.customer_email || session.customer_details?.email || "";
    const phone = meta.customer_phone || "";
    const identifier = meta.customer_identifier || "";
    const message = meta.customer_message || "";
    const orderNumber = `EBAGZ-${sessionId.slice(-8).toUpperCase()}`;
    const issueDate = new Date((session.created || Math.floor(Date.now() / 1000)) * 1000)
      .toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

    const independent = device === "ebagzunlock ";
    if (!service || !device || (!model && !independent) || !name || !email || !phone ||
        (!identifier && !independent) || !Number.isFinite(amount) || amount <= 0) {
      return Response.json({ error: "Les informations de commande sont incomplètes." }, { status: 400 });
    }

    const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
    const safeName = escapeHtml(name);
    const safeService = escapeHtml(service);
    const safeDevice = escapeHtml(device);
    const safeModel = escapeHtml(model);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeIdentifier = escapeHtml(identifier);
    const safeMessage = escapeHtml(message || "Aucune");
    const siteUrl = "https://ebagzunlock.com";
    const logoUrl = `${siteUrl}/background-ebagzunlock.svg`;
    const invoiceHtml = `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px 12px;background:#071321;font-family:Arial,Helvetica,sans-serif;color:#f5f8fc">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;background:#0d1d30;border:1px solid #29425d;border-radius:14px;overflow:hidden">
<tr><td style="padding:28px 24px;text-align:center;background:#081321">
<img src="${logoUrl}" alt="ebagzunlock" width="230" style="display:block;width:230px;max-width:85%;height:auto;margin:0 auto 16px">
<div style="font-size:13px;letter-spacing:2px;color:#9fb8d2">FACTURE CLIENT</div>
<div style="margin-top:9px;font-size:18px;font-weight:bold;color:#fff">N° ${orderNumber}</div>
</td></tr>
<tr><td style="padding:28px 24px">
<p style="margin:0 0 10px;font-size:17px">Bonjour ${safeName},</p>
<p style="margin:0 0 22px;color:#c3cfdd;line-height:1.65">Nous vous remercions pour votre confiance. Votre paiement a bien été reçu et votre commande est confirmée.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
<tr><td colspan="2" style="padding:0 0 12px;font-size:15px;font-weight:bold;color:#8fc5ff">DÉTAILS DE LA COMMANDE</td></tr>
<tr><td style="padding:11px 0;border-top:1px solid #29425d;color:#aebed0">Date</td><td align="right" style="padding:11px 0;border-top:1px solid #29425d;color:#fff">${issueDate}</td></tr>
<tr><td style="padding:11px 0;border-top:1px solid #29425d;color:#aebed0">Prestation</td><td align="right" style="padding:11px 0;border-top:1px solid #29425d;color:#fff">${safeService}</td></tr>
<tr><td style="padding:11px 0;border-top:1px solid #29425d;color:#aebed0">Appareil / option</td><td align="right" style="padding:11px 0;border-top:1px solid #29425d;color:#fff">${safeDevice}</td></tr>
${model ? `<tr><td style="padding:11px 0;border-top:1px solid #29425d;color:#aebed0">Modèle</td><td align="right" style="padding:11px 0;border-top:1px solid #29425d;color:#fff">${safeModel}</td></tr>` : ""}
<tr><td style="padding:14px 0;border-top:1px solid #29425d;color:#fff;font-weight:bold">TOTAL RÉGLÉ</td><td align="right" style="padding:14px 0;border-top:1px solid #29425d;color:#8fc5ff;font-size:21px;font-weight:bold">${amountText} €</td></tr>
</table>
<div style="margin-top:24px;padding:16px;background:#132943;border-radius:9px">
<div style="font-size:13px;color:#9fb8d2;margin-bottom:8px">COORDONNÉES DE COMMANDE</div>
<div style="font-size:14px;line-height:1.8;color:#f5f8fc">Téléphone : ${safePhone}<br>E-mail : ${safeEmail}${identifier ? `<br>Identifiant appareil : ${safeIdentifier}` : ""}${message ? `<br>Informations complémentaires : ${safeMessage}` : ""}</div>
</div>
<p style="margin:24px 0 8px;color:#c3cfdd;line-height:1.6">Merci d'avoir choisi ebagzunlock . Nous restons à votre disposition pour toute question concernant votre commande.</p>
</td></tr>
<tr><td style="padding:22px 24px;text-align:center;background:#081321;border-top:1px solid #29425d">
<div style="font-size:14px;color:#fff">Assistance et contact</div>
<div style="margin-top:10px;font-size:14px"><a href="tel:+33764027733" style="color:#8fc5ff;text-decoration:none">+33 7 64 02 77 33</a></div>
<div style="margin-top:7px;font-size:14px"><a href="mailto:ebagzunlock@outlook.fr" style="color:#8fc5ff;text-decoration:none">ebagzunlock@outlook.fr</a></div>
<div style="margin-top:7px;font-size:14px"><a href="https://ebagzunlock.com" style="color:#8fc5ff;text-decoration:none">ebagzunlock.com</a></div>
<div style="margin-top:18px;font-size:11px;color:#7f91a6">Copyright © 2026 ebagzunlock . Tous droits réservés.</div>
</td></tr></table></body></html>`;

    const orderDetails = [
      `Commande : ${orderNumber}`, `Service : ${service}`, `Appareil / option : ${device}`,
      ...(model ? [`Modèle : ${model}`] : []),
      `Montant payé : ${amountText} €`, `Référence Stripe : ${sessionId}`,
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
      subject: `Nouvelle commande payée — ${orderNumber}`,
      text: orderText
    }, `commande-admin-${sessionId}`);

    // Facture ebagzunlock envoyée en HTML : aucun bouton, lien ou canal WhatsApp.
    await sendEmail({
      from: "ebagzunlock <commandes@ebagzunlock.com>",
      to: [email],
      subject: `Votre facture ${orderNumber} — EBAGZUNLOCK`,
      html: invoiceHtml,
      text: [
        `Bonjour ${name},`, "",
        "Nous confirmons la réception de votre paiement et de votre commande.",
        `Facture : ${orderNumber}`, `Date : ${issueDate}`,
        `Prestation : ${service}`, `Appareil / option : ${device}`,
        ...(model ? [`Modèle : ${model}`] : []),
        `Montant réglé : ${amountText} €`, "",
        "Téléphone : +33 7 64 02 77 33",
        "E-mail : ebagzunlock@outlook.fr",
        "Site : https://ebagzunlock.com",
        "", "Merci pour votre confiance.", "EBAGZUNLOCK"
      ].join("\n")
    }, `facture-client-${sessionId}`);

    return Response.json({ success: true, invoiceNumber: orderNumber });
  } catch (error) {
    console.error("Erreur commande :", error);
    return Response.json({ error: error.message || "Erreur lors de l'envoi de la commande." }, { status: 502 });
  }
}
