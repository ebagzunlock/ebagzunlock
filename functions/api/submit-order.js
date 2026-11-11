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
    const activityDomain = meta.activity_domain || (service === "Création de site web" ? model : "");
    const isCreation = service === "Création de site web" && device === "Site web";
    const orderNumber = /^[A-Z0-9]{14}$/.test(meta.order_number || "") ? meta.order_number : "";
    const address = session.customer_details?.address || {};
    const customerAddress = [address.line1, address.line2, [address.postal_code, address.city].filter(Boolean).join(" "), address.state, address.country].filter(Boolean).join(", ");
    const setupCode = meta.setup_code || "";

    const independent = device === "ebagzunlock " || isCreation;
    if (!service || !device || (!model && !independent) || (isCreation && !activityDomain) || !name || !email || !phone || !orderNumber ||
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
    const safeActivityDomain = escapeHtml(activityDomain);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeIdentifier = escapeHtml(identifier);
    const safeAddress = escapeHtml(customerAddress);
    const safeMessage = escapeHtml(message || "Aucune");
    const invoiceHtml = `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px 12px;background:#081321;font-family:Arial,Helvetica,sans-serif;color:#f5f8fc">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;background:#101f31;border:1px solid #29425d;border-radius:14px;overflow:hidden">
<tr><td style="padding:28px 24px 22px;text-align:center;background:#081321">
<div style="font-size:30px;font-weight:800;letter-spacing:-1px;color:#fff">ebagz<span style="color:#6da5dc">unlock</span><span style="margin-left:5px;color:#fff"></span></div>
<div style="margin-top:12px;font-size:13px;font-weight:bold;letter-spacing:1px;color:#f5f8fc">SERVICES DE DÉVERROUILLAGE</div>
<div style="margin-top:4px;font-size:13px;font-weight:bold;letter-spacing:1px;color:#f5f8fc">&amp; CRÉATION DE SITE WEB</div>
<div style="margin-top:22px;font-size:20px;font-weight:bold;color:#d9b66f">N° ${orderNumber}</div>
</td></tr><tr><td style="padding:26px 24px">
<div style="text-align:center;line-height:1.9;margin-bottom:25px;color:#f5f8fc;font-size:14px"><div>${safeName}</div><div>${safeEmail}</div><div>${safePhone}</div>${safeAddress ? `<div>${safeAddress}</div>` : ""}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
<tr style="background:#081321"><td style="padding:12px 9px;color:#fff;font-size:11px;font-weight:bold">PRESTATION</td><td style="padding:12px 9px;color:#fff;font-size:11px;font-weight:bold">APPAREIL ET MODÈLE</td><td align="right" style="padding:12px 9px;color:#fff;font-size:11px;font-weight:bold">MONTANT</td></tr>
<tr><td style="padding:14px 9px;border-bottom:1px solid #29425d;color:#f5f8fc;font-size:13px">${safeService}</td><td style="padding:14px 9px;border-bottom:1px solid #29425d;color:#f5f8fc;font-size:13px">${isCreation ? `Domaine : ${safeActivityDomain}` : `${safeDevice}${model ? `<br>${safeModel}` : ""}`}</td><td align="right" style="padding:14px 9px;border-bottom:1px solid #29425d;color:#f5f8fc;font-size:13px;white-space:nowrap">${amountText} €</td></tr>
<tr><td colspan="2" style="padding:17px 9px;color:#fff;font-weight:bold">TOTAL PAYÉ</td><td align="right" style="padding:17px 9px;color:#8fc5ff;font-size:20px;font-weight:bold;white-space:nowrap">${amountText} €</td></tr></table>
<div style="margin:28px auto 10px;text-align:center;color:#d9b66f;font-size:16px;font-weight:bold">SETUP CODE</div>
<div style="padding:14px 10px;text-align:center;border:1px solid #d9b66f;border-radius:8px;color:#fff;font-size:16px;font-weight:bold;letter-spacing:1px">${setupCode ? escapeHtml(setupCode) : "COMMUNIQUÉ SÉPARÉMENT PAR NOTRE ÉQUIPE"}</div>
<p style="margin:28px 0 8px;text-align:center;color:#fff;font-size:16px;font-weight:bold">Merci pour votre confiance.</p><p style="margin:0 0 18px;text-align:center;color:#c3cfdd;line-height:1.6;font-size:13px">Pour toute question, notre équipe reste à votre disposition.</p>
<div style="text-align:center;font-size:13px;line-height:2"><div><a href="tel:+33764027733" style="color:#8fc5ff;text-decoration:none">+33 7 64 02 77 33</a></div><div><a href="mailto:ebagzunlock@outlook.fr" style="color:#8fc5ff;text-decoration:none">ebagzunlock@outlook.fr</a></div><div><a href="https://ebagzunlock.com" style="color:#8fc5ff;text-decoration:none">https://ebagzunlock.com</a></div></div>
<div style="margin-top:22px;border-top:2px solid #2f8fe5;padding:18px 8px 4px;text-align:center;font-size:11px;color:#9fb8d2">ebagzunlock — Copyright © 2026. Tous droits réservés.</div>
</td></tr></table></body></html>`;

    const orderDetails = [
      `Commande : ${orderNumber}`, `Service : ${service}`, ...(isCreation ? [`Domaine d’activité : ${activityDomain}`] : [`Appareil / option : ${device}`]),
      ...(!isCreation && model ? [`Modèle : ${model}`] : []),
      `Montant payé : ${amountText} €`, `Référence Stripe : ${sessionId}`,
      `Nom : ${name}`, `E-mail : ${email}`, `Téléphone : ${phone}`, ...(customerAddress ? [`Adresse : ${customerAddress}`] : []),
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

    // Facture client ebagzunlock envoyée en HTML.
    await sendEmail({
      from: "ebagzunlock <commandes@ebagzunlock.com>",
      to: [email],
      subject: `Votre facture ${orderNumber} — EBAGZUNLOCK`,
      html: invoiceHtml,
      text: [
        `Bonjour ${name},`, "",
        "Nous confirmons la réception de votre paiement et de votre commande.",
`N° ${orderNumber}`,
        name, email, phone, ...(customerAddress ? [customerAddress] : []), "",
        `Prestation : ${service}`, isCreation ? `Domaine d’activité : ${activityDomain}` : `Appareil / modèle : ${device}${model ? " — " + model : ""}`,
        `Montant : ${amountText} €`, `TOTAL PAYÉ : ${amountText} €`, "", "SETUP CODE", setupCode || "Communiqué séparément par notre équipe", "",
        "Merci pour votre confiance.",
        "Pour toute question concernant votre commande, notre équipe reste à votre disposition.",
        "+33 7 64 02 77 33", "ebagzunlock@outlook.fr", "https://ebagzunlock.com",
        "", "ebagzunlock ", "Copyright © 2026. Tous droits réservés."
      ].join("\n")
    }, `facture-client-${sessionId}`);

    return Response.json({ success: true, invoiceNumber: orderNumber });
  } catch (error) {
    console.error("Erreur commande :", error);
    return Response.json({ error: error.message || "Erreur lors de l'envoi de la commande." }, { status: 502 });
  }
}
