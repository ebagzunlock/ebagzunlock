export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return new Response("Méthode non autorisée", { status: 405 });
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
    "https://api.stripe.com/v1/checkout/sessions?" + params,
    {
      headers: {
        Authorization: "Bearer " + env.STRIPE_SECRET_KEY
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return Response.json(
      { error: "Erreur Stripe", details: data.error?.message },
      { status: 502 }
    );
  }

  const session = data.data?.[0];

  if (!session || session.payment_status !== "paid") {
    return Response.json(
      { error: "Session payée introuvable" },
      { status: 404 }
    );
  }

  return Response.json({
    success: true,
    sessionId: session.id
  });
