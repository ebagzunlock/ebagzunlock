
export async function onRequestGet({ request, env }) {
  try {
    if (!env.STRIPE_SECRET_KEY) {
      return Response.json(
        { error: "Configuration Stripe manquante." },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");

    if (
      !sessionId ||
      !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)
    ) {
      return Response.json(
        { error: "Identifiant de paiement invalide." },
        { status: 400 }
      );
    }

    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`
        }
      }
    );

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error("Stripe verification error:", session);

      return Response.json(
        { error: "Impossible de vérifier le paiement." },
        { status: 502 }
      );
    }

    const paid =
      session.payment_status === "paid" &&
      session.status === "complete";

    if (!paid) {
      return Response.json({
        paid: false,
        paymentStatus: session.payment_status,
        selection: null
      });
    }

    const service = session.metadata?.service || null;
    const device = session.metadata?.device || null;
    const model = session.metadata?.model || null;

    if (!service || !device || (device !== "ebagzunlock " && !model)) {
      return Response.json(
        { error: "Informations de commande manquantes." },
        { status: 400 }
      );
    }

    return Response.json({
      paid: true,
      paymentStatus: session.payment_status,
      selection: {
        service,
        device,
        model
      }
    });

  } catch (error) {
    console.error("Erreur vérification Stripe :", error);

    return Response.json(
      { error: "Erreur lors de la vérification du paiement." },
      { status: 500 }
    );
  }
}
