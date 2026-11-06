export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return new Response("Méthode non autorisée", { status: 405 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!env.RECOVERY_TOKEN || token !== env.RECOVERY_TOKEN) {
    return Response.json({ error: "Accès refusé" }, { status: 403 });
  }

  if (!env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Clé Stripe absente" }, { status: 500 });
  }

  const paymentIntent = "pi_3UYacw75EdsO57RN09ElqC28";

  const params = new URLSearchParams({
    payment_intent: paymentIntent,
    limit: "1"
  });

  const response = await fetch(
    "https://api.stripe.com/v1/checkout/sessions?" + params.toString(),
    {
      headers: {
        Authorization: "Bearer " + env.STRIPE_SECRET_KEY
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return Response.json(
      { error: data.error?.message || "Erreur Stripe" },
      { status: 502 }
    );
  }

  const session = data.data?.[0];

  if (
    !session ||
    session.payment_status !== "paid" ||
    session.payment_intent !== paymentIntent ||
    session.amount_total !== 200 ||
    session.currency !== "eur"
  ) {
    return Response.json(
      { error: "Session payée correspondante introuvable" },
      { status: 404 }
    );
  }

  return Response.json({
    success: true,
    sessionId: session.id
  });
}
