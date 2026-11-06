
export async function onRequestPost({ request, env }) {
  try {
    if (!env.STRIPE_SECRET_KEY || !env.RESEND_API_KEY) {
      return Response.json(
        { error: "Configuration serveur manquante." },
        { status: 500 }
      );
    }

    const data = await request.json();

    const sessionId = data.sessionId;
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.phone || "").trim();
    const identifier = String(data.identifier || "").trim();
    const message = String(data.message || "").trim();

    if (
      !sessionId ||
      !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId) ||
      !name || !email || !phone || !identifier ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return Response.json(
        { error: "Informations de commande invalides." },
        { status: 400 }
      );
    }

    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`
        }
      }
    );

    const session = await stripeResponse.json();

    if (
      !stripeResponse.ok ||
      session.payment_status !== "paid" ||
      session.status !== "complete"
    ) {
      return Response.json(
        { error: "Paiement non confirmé. Commande non envoyée." },
        { status: 403 }
      );
    }

    const service = session.metadata?.service || "";
    const device = session.metadata?.device || "";
    const model = session.metadata?.model || "";
    const amount = session.metadata?.amount_eur || "";

    if (!service || !model) {
      return Response.json(
        { error: "Informations de paiement manquantes." },
        { status: 400 }
      );
    }

    const text = [
      "NOUVELLE COMMANDE PAYÉE — EBAGZUNLOCK",
      "",
      `Service : ${service}`,
      `Option / appareil : ${device}`,
      `Modèle : ${model}`,
      `Montant : ${amount} €`,
      `Référence Stripe : ${sessionId}`,
      "",
      `Nom : ${name}`,
      `E-mail : ${email}`,
      `Téléphone : ${phone}`,
      `IMEI / numéro de série : ${identifier}`,
      "",
      "Informations complémentaires :",
      message || "Aucune"
    ].join("\n");

    const mailResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `commande-${sessionId}`
        },
        body: JSON.stringify({
          from: "ebagzunlock <commandes@ebagzunlock.com>",
          to: ["ebagzunlock@outlook.fr"],
          reply_to: email,
          subject: `Nouvelle commande payée — ${model}`,
          text
        })
      }
    );

    if (!mailResponse.ok) {
      const error = await mailResponse.text();
      console.error("Erreur Resend :", error);

      return Response.json(
        { error: "L'envoi de l'e-mail a échoué." },
        { status: 502 }
      );
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error("Erreur commande :", error);

    return Response.json(
      { error: "Erreur lors de l'envoi de la commande." },
      { status: 500 }
    );
  }
}
