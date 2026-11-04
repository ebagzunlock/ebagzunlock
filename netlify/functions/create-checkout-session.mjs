import Stripe from "stripe";

const PRODUCTS = [
  {
    "id": "iphone-service-1",
    "name": "iPhone X – iPhone 12 Pro",
    "amount": 3800
  },
  {
    "id": "iphone-service-2",
    "name": "iPhone 12 Pro Max – iPhone 14",
    "amount": 5500
  },
  {
    "id": "iphone-service-3",
    "name": "iPhone 14 Plus – iPhone 15",
    "amount": 6000
  },
  {
    "id": "iphone-service-4",
    "name": "iPhone 15 Plus – iPhone 16",
    "amount": 6700
  },
  {
    "id": "iphone-service-5",
    "name": "iPhone 16 Plus – iPhone 16e",
    "amount": 7100
  },
  {
    "id": "iphone-service-6",
    "name": "iPhone 17 – iPhone 17e",
    "amount": 11500
  },
  {
    "id": "iphone-service-7",
    "name": "iPhone 18 Pro",
    "amount": 13500
  },
  {
    "id": "iphone-service-8",
    "name": "iPhone 18 Pro Max",
    "amount": 15500
  },
  {
    "id": "iphone-service-9",
    "name": "iPhone Duo",
    "amount": 13250
  },
  {
    "id": "iphone-service-10",
    "name": "iPhone 17 Air",
    "amount": 11950
  }
];
const PRODUCT_MAP = new Map(PRODUCTS.map((product) => [product.id, product]));

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  },
});

export default async (request) => {
  if (request.method !== "POST") {
    return json({ error: "Méthode non autorisée." }, 405);
  }

  const siteUrl = process.env.URL;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!siteUrl || !secretKey) {
    console.error("Missing Netlify URL or STRIPE_SECRET_KEY environment variable.");
    return json({ error: "Le paiement n'est pas encore configuré. Contactez le support." }, 503);
  }

  // Only accept requests coming from this deployed site.
  const origin = request.headers.get("origin");
  try {
    if (origin && new URL(origin).host !== new URL(siteUrl).host) {
      return json({ error: "Origine non autorisée." }, 403);
    }
  } catch {
    return json({ error: "Origine invalide." }, 403);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Requête invalide." }, 400);
  }

  const product = PRODUCT_MAP.get(payload?.productId);
  if (!product) {
    return json({ error: "Prestation inconnue. Actualisez la page et réessayez." }, 400);
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: product.amount,
          product_data: {
            name: `Prestation de désimlockage opérateur autorisé — ${product.name}`,
            description: "Prestation sur un appareil appartenant au client ou pour lequel il dispose d'une autorisation.",
          },
        },
      }],
      billing_address_collection: "auto",
      success_url: `${siteUrl}/paiement-reussi.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/paiement-annule.html`,
      metadata: {
        product_id: product.id,
        service_type: "authorized_carrier_unlock",
      },
    });

    return json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout session creation failed:", error);
    return json({ error: "Stripe n'a pas pu créer la session de paiement. Réessayez ou contactez-nous." }, 502);
  }
};
