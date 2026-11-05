export async function onRequestGet({ request, env }) {
  try {
    if (!env.STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: "Configuration Stripe manquante." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      return new Response(
        JSON.stringify({ error: "Identifiant de paiement invalide." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
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
      return new Response(
        JSON.stringify({
          error: "Impossible de vérifier le paiement."
        }),
        {
          status: stripeResponse.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const paid = session.payment_status === "paid";

    return new Response(
      JSON.stringify({
        paid,
        paymentStatus: session.payment_status,
        selection: paid
          ? {
              service: session.metadata?.service || null,
              device: session.metadata?.device || null,
              model: session.metadata?.model || null
            }
          : null
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Erreur vérification Stripe :", error);

    return new Response(
      JSON.stringify({ error: "Erreur lors de la vérification du paiement." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
