
const SERVICES = [
  "Déverrouillage iCloud",
  "Déverrouillage Opérateur",
  "Suppression Blocage & Limitation Propriétaire",
  "Résolution Blocage DFU & Mode de Récupération",
  "Mise à jour iOS / macOS"
];

const UPDATE_PRICES = {
  "iOS": 7,
  "macOS": 15,
  "ebagzunlock": 2
};

const CATALOGUE = {
  "iPhone": {
    "iPhone X":25,"iPhone XR":25,"iPhone XS":25,"iPhone XS Max":25,
    "iPhone 11":25,"iPhone 11 Pro":25,"iPhone 11 Pro Max":27,
    "iPhone 12 mini":25,"iPhone 12":25,"iPhone 12 Pro":29,"iPhone 12 Pro Max":32,
    "iPhone 13 mini":39,"iPhone 13":40,"iPhone 13 Pro":40,"iPhone 13 Pro Max":42,
    "iPhone 14":40,"iPhone 14 Plus":40,"iPhone 14 Pro":43,"iPhone 14 Pro Max":49,
    "iPhone 15":53,"iPhone 15 Plus":55,"iPhone 15 Pro":55,"iPhone 15 Pro Max":59,
    "iPhone 16":64,"iPhone 16 Plus":59,"iPhone 16 Pro":62,"iPhone 16 Pro Max":69,"iPhone 16e":65,
    "iPhone 17":69,"iPhone 17 Pro":70,"iPhone 17 Pro Max":77,"iPhone 17e":75,"iPhone 17 Air":79,
    "iPhone 18":85,"iPhone 18 Pro":89,"iPhone 18 Pro Max":100,"iPhone 18 Duo":95
  },

  "MacBook": {
    "MacBook Air Intel 2008–2020":35,"MacBook Air M1":38,
    "MacBook Air M2 13/15 pouces":38,"MacBook Air M3 13/15 pouces":40,
    "MacBook Air M4 13/15 pouces":40,"MacBook Air M5 13/15 pouces":42,
    "MacBook Pro Intel":40,"MacBook Pro M1 13/14/16 pouces":45,
    "MacBook Pro M2":45,"MacBook Pro M3 14/16 pouces":45,
    "MacBook Pro M4 14/16 pouces":49,"MacBook Pro M5 14/16 pouces":49,
    "MacBook Pro M6 14 pouces":55,"MacBook 12 pouces 2015–2017":30,
    "MacBook Neo A18 Pro":133
  },

  "iPad": {
    "iPad classique 1re–11e génération (A16 inclus)":37,
    "iPad mini 1–6 (A17 Pro inclus)":39,"iPad Air 1–5":37,
    "iPad Air M2/M3/M4 11/13 pouces":35,"iPad Pro 9.7 pouces":39,
    "iPad Pro 10,5 pouces":39,"iPad Pro 11 pouces générations 1–5":45,
    "iPad Pro 12.9 pouces générations 1–6":49,
    "iPad Pro M4 11/13 pouces":52,"iPad Pro M5 11/13 pouces":55
  },

  "Apple Watch": {
    "Apple Watch Series 1–12":54,"Apple Watch SE 1/2/3":63,
    "Apple Watch Ultra 1/2/3/4":69
  }
};

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_SECRET_KEY) {
    return Response.json(
      { error: "La clé Stripe n'est pas configurée." },
      { status: 503 }
    );
  }

  const origin = request.headers.get("Origin");
  const siteOrigin = new URL(request.url).origin;

  if (origin && origin !== siteOrigin) {
    return Response.json(
      { error: "Origine non autorisée." },
      { status: 403 }
    );
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }

  const { service, device, model } = payload || {};

  if (!SERVICES.includes(service)) {
    return Response.json(
      { error: "Prestation invalide." },
      { status: 400 }
    );
  }

  let amount;

  if (service === "Mise à jour iOS / macOS") {
    if (
      typeof model !== "string" ||
      !Object.prototype.hasOwnProperty.call(UPDATE_PRICES, model) ||
      device !== model
    ) {
      return Response.json(
        { error: "Option de mise à jour invalide." },
        { status: 400 }
      );
    }

    amount = UPDATE_PRICES[model];

  } else {
    if (
      typeof device !== "string" ||
      typeof model !== "string" ||
      !Object.prototype.hasOwnProperty.call(CATALOGUE, device) ||
      !Object.prototype.hasOwnProperty.call(CATALOGUE[device], model)
    ) {
      return Response.json(
        { error: "Sélection de prestation ou d'appareil invalide." },
        { status: 400 }
      );
    }

    amount = CATALOGUE[device][model];
  }

  const params = new URLSearchParams();

  params.set("mode", "payment");
  params.set("ui_mode", "embedded");
  params.set("redirect_on_completion", "always");
  params.set("invoice_creation[enabled]", "true");
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "eur");
  params.set(
    "line_items[0][price_data][unit_amount]",
    String(amount * 100)
  );

  const productName = service === "Mise à jour iOS / macOS"
    ? `Mise à jour — ${model}`
    : `${service} — ${device} — ${model}`;

  params.set(
    "line_items[0][price_data][product_data][name]",
    productName
  );

  params.set(
    "line_items[0][price_data][product_data][description]",
    "Prestation réalisée uniquement dans un cadre légal, avec l'autorisation du propriétaire."
  );

  params.set("billing_address_collection", "auto");

  // Retour après paiement intégré : vérification serveur de la session.
  params.set(
    "return_url",
    `${siteOrigin}/?page=offres&session_id={CHECKOUT_SESSION_ID}#tarifs`
  );

  params.set("metadata[service]", service);
  params.set("metadata[device]", device || "");
  params.set("metadata[model]", model);
  params.set("metadata[amount_eur]", String(amount));

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

    return Response.json({ client_secret: session.client_secret });

  } catch (error) {
    console.error("Checkout error:", error);

    return Response.json(
      { error: "Impossible de contacter Stripe." },
      { status: 502 }
    );
  }
}
