const PRODUCTS = [
  { id: "update", name: "UPDATE", amount: 500 },
  { id: "iphone-service-1", name: "iPhone X – iPhone 12 Pro", amount: 3800 },
  { id: "iphone-service-2", name: "iPhone 12 Pro Max – iPhone 14", amount: 5500 },
  { id: "iphone-service-3", name: "iPhone 14 Plus – iPhone 15", amount: 6000 },
  { id: "iphone-service-4", name: "iPhone 15 Plus – iPhone 16", amount: 6700 },
  { id: "iphone-service-5", name: "iPhone 16 Plus – iPhone 16e", amount: 7100 },
  { id: "iphone-service-6", name: "iPhone 17 – iPhone 17e", amount: 11500 },
  { id: "iphone-service-7", name: "iPhone 18 Pro", amount: 13500 },
  { id: "iphone-service-8", name: "iPhone 18 Pro Max", amount: 15500 },
  { id: "iphone-service-9", name: "iPhone Duo", amount: 13250 },
  { id: "iphone-service-10", name: "iPhone 17 Air", amount: 11950 }
];

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_SECRET_KEY || !env.SITE_URL) {
    return Response.json(
      { error: "Le paiement n'est pas encore configuré." },
      { status: 503 }
    );
  }

  const origin = request.headers.get("Origin");

  try {
    if (origin && new URL(origin).host !== new URL(env.SITE_URL).host) {
      return Response.json({ error: "Origine non autorisée." }, { status: 403 });
    }
  } catch {
    return Response.json({ error: "Origine invalide." }, { status: 403 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const product = PRODUCTS.find((item) => item.id === payload?.productId);

  if (!product) {
    return Response.json({ error: "Prestation inconnue." }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
 
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "eur");
  params.set("line_items[0][price_data][unit_amount]", String(product.amount));
  params.set(
    "line_items[0][price_data][product_data][name]",
    `Prestation de désimlockage opérateur autorisé — ${product.name}`
  );
  params.set(
    "line_items[0][price_data][product_data][description]",
    "Prestation sur un appareil appartenant au client ou pour lequel il dispose d'une autorisation."
  );
  params.set("billing_address_collection", "auto");
 params.set(
  "success_url",
  `${new URL(request.url).origin}/paiement-reussi.html?session_id={CHECKOUT_SESSION_ID}`
);
params.set(
  "cancel_url",
  `${new URL(request.url).origin}/paiement-annule.html`
);
  params.set("metadata[product_id]", product.id);
  params.set("metadata[service_type]", "authorized_carrier_unlock");

  try {
    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      }
    );

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error("Stripe error:", session);
      return Response.json(
        { error: "Stripe n'a pas pu créer le paiement." },
        { status: 502 }
      );
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json(
      { error: "Impossible de contacter Stripe." },
      { status: 502 }
    );
  }
}
