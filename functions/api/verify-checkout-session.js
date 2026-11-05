export async function onRequestGet({ request, env }) {
  if (!env.STRIPE_SECRET_KEY) {
    return Response.json(
      { error: "Vérification du paiement non configurée." },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId || !/^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(sessionId)) {
    return Response.json(
      { error: "Référence de paiement invalide." },
      { status: 400 }
    );
  }

  try {
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`
        }
      }
    );

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return Response.json(
        { error: "Impossible de vérifier le paiement." },
        { status: 502 }
      );
    }

    return Response.json({
      paid: session.payment_status === "paid",
      productId: session.metadata?.product_id || null,
      paymentStatus: session.payment_status
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return Response.json(
      { error: "Erreur lors de la vérification du paiement." },
      { status: 502 }
    );
  }
}
