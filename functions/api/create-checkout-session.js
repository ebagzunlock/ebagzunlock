const SERVICES = [
  "Déverrouillage iCloud",
  "Déverrouillage Opérateur",
  "SNAP-error/ban",
  "Suppression Blocage & Limitation Propriétaire",
  "Résolution Blocage DFU & Mode de Récupération",
  "Mise à jour iOS / macOS",
  "Création de site web"
];

const CREATION_PRICES = {"Commerce":357,"Restauration":405,"Beauté":405,"Santé et bien-être":405,"Immobilier":510,"Transport":550,"Tourisme":376.75,"Services professionnels":615,"Éducation":410,"Artisanat & bâtiment":457,"Événementiel":510,"Associations":605,"Technologie":730,"Autres":800};

const UPDATE_SYSTEMS = { iPhone: "iOS", iPad: "iPadOS", MacBook: "macOS", "Apple Watch": "watchOS" };
const UPDATE_PRICES = { iOS: 15, iPadOS: 10, macOS: 13, watchOS: 8, "ebagzunlock ": 2 };

const CATALOGUE = {
  "iPhone": {
    "iPhone X": 25,
    "iPhone XR": 25,
    "iPhone XS": 25,
    "iPhone XS Max": 25,
    "iPhone 11": 25,
    "iPhone 11 Pro": 25,
    "iPhone 11 Pro Max": 27,
    "iPhone 12 mini": 25,
    "iPhone 12": 25,
    "iPhone 12 Pro": 29,
    "iPhone 12 Pro Max": 32,
    "iPhone 13 mini": 39,
    "iPhone 13": 40,
    "iPhone 13 Pro": 40,
    "iPhone 13 Pro Max": 42,
    "iPhone 14": 40,
    "iPhone 14 Plus": 40,
    "iPhone 14 Pro": 43,
    "iPhone 14 Pro Max": 49,
    "iPhone 15": 53,
    "iPhone 15 Plus": 55,
    "iPhone 15 Pro": 55,
    "iPhone 15 Pro Max": 59,
    "iPhone 16": 64,
    "iPhone 16 Plus": 59,
    "iPhone 16 Pro": 62,
    "iPhone 16 Pro Max": 69,
    "iPhone 16e": 65,
    "iPhone 17": 69,
    "iPhone 17 Pro": 70,
    "iPhone 17 Pro Max": 77,
    "iPhone 17e": 75,
    "iPhone 17 Air": 79,
    "iPhone 18": 85,
    "iPhone 18 Pro": 89,
    "iPhone 18 Pro Max": 100,
    "iPhone 18 Duo": 95
  },
  "iPad": {
    "iPad (1re génération)": 37,
    "iPad 2": 37,
    "iPad (3e génération)": 37,
    "iPad (4e génération)": 37,
    "iPad (5e génération)": 37,
    "iPad (6e génération)": 37,
    "iPad (7e génération)": 37,
    "iPad (8e génération)": 37,
    "iPad (9e génération)": 37,
    "iPad (10e génération)": 37,
    "iPad (11e génération — A16)": 37,
    "iPad mini (1re génération)": 39,
    "iPad mini 2": 39,
    "iPad mini 3": 39,
    "iPad mini 4": 39,
    "iPad mini (5e génération)": 39,
    "iPad mini (6e génération)": 39,
    "iPad mini (7e génération — A17 Pro)": 39,
    "iPad mini (A20 Pro, 2026)": 39,
    "iPad Air (1re génération)": 37,
    "iPad Air 2": 37,
    "iPad Air (3e génération)": 37,
    "iPad Air (4e génération)": 37,
    "iPad Air (5e génération)": 37,
    "iPad Air 11 pouces (M2)": 35,
    "iPad Air 13 pouces (M2)": 35,
    "iPad Air 11 pouces (M3)": 35,
    "iPad Air 13 pouces (M3)": 35,
    "iPad Air 11 pouces (M4)": 35,
    "iPad Air 13 pouces (M4)": 35,
    "iPad Pro 9,7 pouces (1re génération)": 39,
    "iPad Pro 10,5 pouces (2e génération)": 39,
    "iPad Pro 12,9 pouces (1re génération)": 49,
    "iPad Pro 12,9 pouces (2e génération)": 49,
    "iPad Pro 12,9 pouces (3e génération)": 49,
    "iPad Pro 12,9 pouces (4e génération)": 49,
    "iPad Pro 12,9 pouces (5e génération)": 49,
    "iPad Pro 12,9 pouces (6e génération)": 49,
    "iPad Pro 11 pouces (1re génération)": 45,
    "iPad Pro 11 pouces (2e génération)": 45,
    "iPad Pro 11 pouces (3e génération)": 45,
    "iPad Pro 11 pouces (4e génération — M2)": 45,
    "iPad Pro 11 pouces (M4)": 52,
    "iPad Pro 13 pouces (M4)": 52,
    "iPad Pro 11 pouces (M5)": 55,
    "iPad Pro 13 pouces (M5)": 55
  },
  "MacBook": {
    "MacBook Air 11 pouces (2010)": 35,
    "MacBook Air 11 pouces (2011)": 35,
    "MacBook Air 11 pouces (2012)": 35,
    "MacBook Air 11 pouces (2013)": 35,
    "MacBook Air 11 pouces (2014)": 35,
    "MacBook Air 11 pouces (2015)": 35,
    "MacBook Air 13 pouces (2008)": 35,
    "MacBook Air 13 pouces (2009)": 35,
    "MacBook Air 13 pouces (2010)": 35,
    "MacBook Air 13 pouces (2011)": 35,
    "MacBook Air 13 pouces (2012)": 35,
    "MacBook Air 13 pouces (2013)": 35,
    "MacBook Air 13 pouces (2014)": 35,
    "MacBook Air 13 pouces (2015)": 35,
    "MacBook Air 13 pouces (2017)": 35,
    "MacBook Air Retina 13 pouces (2018)": 35,
    "MacBook Air Retina 13 pouces (2019)": 35,
    "MacBook Air Retina 13 pouces (2020 Intel)": 35,
    "MacBook Air 13 pouces (M1, 2020)": 38,
    "MacBook Air 13 pouces (M2, 2022)": 38,
    "MacBook Air 15 pouces (M2, 2023)": 38,
    "MacBook Air 13 pouces (M3, 2024)": 40,
    "MacBook Air 15 pouces (M3, 2024)": 40,
    "MacBook Air 13 pouces (M4, 2025)": 40,
    "MacBook Air 15 pouces (M4, 2025)": 40,
    "MacBook Air 13 pouces (M5, 2026)": 42,
    "MacBook Air 15 pouces (M5, 2026)": 42,
    "MacBook Pro 13 pouces (2009, Intel)": 40,
    "MacBook Pro 13 pouces (2010, Intel)": 40,
    "MacBook Pro 13 pouces (2011, Intel)": 40,
    "MacBook Pro 13 pouces (2012, Intel)": 40,
    "MacBook Pro 13 pouces (2013, Intel)": 40,
    "MacBook Pro 13 pouces (2014, Intel)": 40,
    "MacBook Pro 13 pouces (2015, Intel)": 40,
    "MacBook Pro 13 pouces (2016, Intel)": 40,
    "MacBook Pro 13 pouces (2017, Intel)": 40,
    "MacBook Pro 13 pouces (2018, Intel)": 40,
    "MacBook Pro 13 pouces (2019, Intel)": 40,
    "MacBook Pro 13 pouces (2020, Intel)": 40,
    "MacBook Pro 15 pouces (2006, Intel)": 40,
    "MacBook Pro 15 pouces (2007, Intel)": 40,
    "MacBook Pro 15 pouces (2008, Intel)": 40,
    "MacBook Pro 15 pouces (2009, Intel)": 40,
    "MacBook Pro 15 pouces (2010, Intel)": 40,
    "MacBook Pro 15 pouces (2011, Intel)": 40,
    "MacBook Pro 15 pouces (2012, Intel)": 40,
    "MacBook Pro 15 pouces (2013, Intel)": 40,
    "MacBook Pro 15 pouces (2014, Intel)": 40,
    "MacBook Pro 15 pouces (2015, Intel)": 40,
    "MacBook Pro 15 pouces (2016, Intel)": 40,
    "MacBook Pro 15 pouces (2017, Intel)": 40,
    "MacBook Pro 15 pouces (2018, Intel)": 40,
    "MacBook Pro 15 pouces (2019, Intel)": 40,
    "MacBook Pro 16 pouces (2019, Intel)": 40,
    "MacBook Pro 16 pouces (2020, Intel)": 40,
    "MacBook Pro 17 pouces (2006, Intel)": 40,
    "MacBook Pro 17 pouces (2007, Intel)": 40,
    "MacBook Pro 17 pouces (2008, Intel)": 40,
    "MacBook Pro 17 pouces (2009, Intel)": 40,
    "MacBook Pro 17 pouces (2010, Intel)": 40,
    "MacBook Pro 17 pouces (2011, Intel)": 40,
    "MacBook Pro 13 pouces (M1, 2020)": 45,
    "MacBook Pro 14 pouces (M1 Pro/M1 Max, 2021)": 45,
    "MacBook Pro 16 pouces (M1 Pro/M1 Max, 2021)": 45,
    "MacBook Pro 13 pouces (M2, 2022)": 45,
    "MacBook Pro 14 pouces (M2 Pro/M2 Max, 2023)": 45,
    "MacBook Pro 16 pouces (M2 Pro/M2 Max, 2023)": 45,
    "MacBook Pro 14 pouces (M3, 2023)": 45,
    "MacBook Pro 16 pouces (M3, 2023)": 45,
    "MacBook Pro 14 pouces (M4, 2024)": 49,
    "MacBook Pro 14 pouces (M4 Pro/M4 Max, 2024)": 49,
    "MacBook Pro 16 pouces (M4 Pro/M4 Max, 2024)": 49,
    "MacBook Pro 14 pouces (M5, 2025)": 49,
    "MacBook Pro 14 pouces (M5 Pro/M5 Max, 2026)": 49,
    "MacBook Pro 16 pouces (M5 Pro/M5 Max, 2026)": 49,
    "MacBook Pro 14 pouces (M5 Pro, 2026)": 49,
    "MacBook Pro 14 pouces (M5 Max, 2026)": 49,
    "MacBook Pro 16 pouces (M5 Pro, 2026)": 49,
    "MacBook Pro 16 pouces (M5 Max, 2026)": 49,
    "MacBook Pro 14 pouces (M6, 2026)": 55,
    "MacBook 12 pouces (2015)": 30,
    "MacBook 12 pouces (2016)": 30,
    "MacBook 12 pouces (2017)": 30,
    "MacBook Neo (A18 Pro, 2026)": 133
  },
  "Apple Watch": {
    "Apple Watch Series 1 — 38 mm": 54,
    "Apple Watch Series 1 — 42 mm": 54,
    "Apple Watch Series 2 — 38 mm": 54,
    "Apple Watch Series 2 — 42 mm": 54,
    "Apple Watch Series 3 — 38 mm": 54,
    "Apple Watch Series 3 — 42 mm": 54,
    "Apple Watch Series 4 — 40 mm": 54,
    "Apple Watch Series 4 — 44 mm": 54,
    "Apple Watch Series 5 — 40 mm": 54,
    "Apple Watch Series 5 — 44 mm": 54,
    "Apple Watch Series 6 — 40 mm": 54,
    "Apple Watch Series 6 — 44 mm": 54,
    "Apple Watch Series 7 — 41 mm": 54,
    "Apple Watch Series 7 — 45 mm": 54,
    "Apple Watch Series 8 — 41 mm": 54,
    "Apple Watch Series 8 — 45 mm": 54,
    "Apple Watch Series 9 — 41 mm": 54,
    "Apple Watch Series 9 — 45 mm": 54,
    "Apple Watch Series 10 — 42 mm": 54,
    "Apple Watch Series 10 — 46 mm": 54,
    "Apple Watch Series 11 — 42 mm": 54,
    "Apple Watch Series 11 — 46 mm": 54,
    "Apple Watch Series 12 — 42 mm": 54,
    "Apple Watch Series 12 — 46 mm": 54,
    "Apple Watch SE (1re génération) — 40 mm": 63,
    "Apple Watch SE (1re génération) — 44 mm": 63,
    "Apple Watch SE (2e génération) — 40 mm": 63,
    "Apple Watch SE (2e génération) — 44 mm": 63,
    "Apple Watch SE (3e génération) — 40 mm": 63,
    "Apple Watch SE (3e génération) — 44 mm": 63,
    "Apple Watch Ultra (1re génération) — 49 mm": 69,
    "Apple Watch Ultra 2 — 49 mm": 69,
    "Apple Watch Ultra 3 — 49 mm": 69,
    "Apple Watch Ultra 4 — 49 mm": 69
  }
};


export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_SECRET_KEY) return Response.json({ error: "La clé Stripe n'est pas configurée." }, { status: 503 });

  const origin = request.headers.get("Origin");
  const siteOrigin = new URL(request.url).origin;
  if (origin && origin !== siteOrigin) return Response.json({ error: "Origine non autorisée." }, { status: 403 });

  let payload;
  try { payload = await request.json(); }
  catch { return Response.json({ error: "Requête invalide." }, { status: 400 }); }

  const { service, device, model, customer = {}, orderNumber = "", consentAccepted = false, locale: requestedLocale = "fr" } = payload || {};

  // Stripe Checkout Elements : locale de la session, dérivée du choix du site.
  const supportedLocales = new Set(["auto","bg","cs","da","de","el","en","en-GB","es","es-419","et","fi","fil","fr","fr-CA","hr","hu","id","it","ja","ko","lt","lv","ms","mt","nb","nl","pl","pt","pt-BR","ro","ru","sk","sl","sv","th","tr","vi","zh","zh-HK","zh-TW"]);
  const localeAliases = { "zh-CN": "zh", "pt": "pt", "en": "en", "fr": "fr" };
  const stripeLocale = localeAliases[requestedLocale] || requestedLocale;
  const checkoutLocale = supportedLocales.has(stripeLocale) ? stripeLocale : "auto";
  if (!/^[A-Z0-9]{14}$/.test(String(orderNumber))) return Response.json({ error: "Numéro de commande manquant ou invalide. Revenez au récapitulatif." }, { status: 400 });
  if (!SERVICES.includes(service)) return Response.json({ error: "Prestation invalide." }, { status: 400 });
  if (["SNAP-error/ban","Déverrouillage Opérateur"].includes(service) && device !== "iPhone") return Response.json({ error: "Ce service est disponible uniquement pour iPhone." }, { status: 400 });
  if (consentAccepted !== true) return Response.json({ error: "Veuillez accepter les conditions générales de vente avant de procéder au paiement." }, { status: 400 });

  const name = String(customer.name || "").trim().slice(0, 120);
  const email = String(customer.email || "").trim().slice(0, 200);
  const phone = String(customer.phone || "").trim().slice(0, 60);
  const identifier = String(customer.identifier || "").trim().slice(0, 120);
  const message = String(customer.message || "").trim().slice(0, 450);

  const isCreation = service === "Création de site web" && device === "Site web";
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || (device !== "ebagzunlock " && !isCreation && !identifier)) {
    return Response.json({ error: "Veuillez compléter les coordonnées et les informations de l'appareil avant le paiement." }, { status: 400 });
  }

  const independent = device === "ebagzunlock " || isCreation;
  const validDevice = ["iPhone","iPad","MacBook","Apple Watch","ebagzunlock ","Site web"].includes(device);
  const identifierValid = independent
    ? !identifier
    : device === "iPhone" && service === "Déverrouillage Opérateur"
      ? /^\d{14,16}$/.test(identifier)
      : Boolean(identifier);
  if (!validDevice || !identifierValid) {
    return Response.json({ error: "Identifiant invalide pour l’appareil ou la prestation sélectionnée." }, { status: 400 });
  }
  let amount;
  if (isCreation) {
    if (!Object.prototype.hasOwnProperty.call(CREATION_PRICES, model || "")) return Response.json({ error: "Domaine d’activité invalide." }, { status: 400 });
    amount = CREATION_PRICES[model];
  } else if (service === "Mise à jour iOS / macOS") {
    if (device === "ebagzunlock " && !model) {
      amount = UPDATE_PRICES["ebagzunlock "];
    } else {
      const system = UPDATE_SYSTEMS[device];
      if (!system || typeof model !== "string" || !Object.prototype.hasOwnProperty.call(CATALOGUE[device] || {}, model)) {
        return Response.json({ error: "Option de mise à jour invalide." }, { status: 400 });
      }
      amount = UPDATE_PRICES[system];
    }
  } else {
    if (typeof device !== "string" || typeof model !== "string" || !Object.prototype.hasOwnProperty.call(CATALOGUE, device) || !Object.prototype.hasOwnProperty.call(CATALOGUE[device], model)) {
      return Response.json({ error: "Sélection de prestation ou d'appareil invalide." }, { status: 400 });
    }
    amount = CATALOGUE[device][model];
  }

  // Les virements SEPA via customer_balance nécessitent un Customer Stripe existant.
  // On réutilise celui de l'adresse e-mail, sinon on le crée avant la session.
  let stripeCustomer;
  try {
    const lookupUrl = new URL("https://api.stripe.com/v1/customers");
    lookupUrl.searchParams.set("email", email);
    lookupUrl.searchParams.set("limit", "1");
    const lookupResponse = await fetch(lookupUrl, {
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "Stripe-Version": "2026-09-30.endive" }
    });
    const lookup = await lookupResponse.json();
    if (!lookupResponse.ok) {
      console.error("Stripe customer lookup error:", lookup);
      return Response.json({ error: "Impossible de vérifier le profil client auprès de Stripe." }, { status: 502 });
    }
    stripeCustomer = lookup.data && lookup.data[0];
    if (!stripeCustomer) {
      const customerParams = new URLSearchParams();
      customerParams.set("email", email);
      customerParams.set("name", name);
      if (phone) customerParams.set("phone", phone);
      const createCustomerResponse = await fetch("https://api.stripe.com/v1/customers", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded", "Stripe-Version": "2026-09-30.endive" },
        body: customerParams
      });
      stripeCustomer = await createCustomerResponse.json();
      if (!createCustomerResponse.ok) {
        console.error("Stripe customer creation error:", stripeCustomer);
        return Response.json({ error: "Stripe n'a pas pu créer le profil client nécessaire au virement bancaire." }, { status: 502 });
      }
    }
  } catch (error) {
    console.error("Stripe customer error:", error);
    return Response.json({ error: "Impossible de préparer le profil client auprès de Stripe." }, { status: 502 });
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("locale", checkoutLocale);
  params.set("ui_mode", "embedded_page");
  params.set("invoice_creation[enabled]", "true");
  params.set("customer", stripeCustomer.id);
  // Virement bancaire européen en euros : Stripe fournit les coordonnées et la référence au client.
  params.set("payment_method_options[customer_balance][funding_type]", "bank_transfer");
  params.set("payment_method_options[customer_balance][bank_transfer][type]", "eu_bank_transfer");
  params.set("payment_method_options[customer_balance][bank_transfer][eu_bank_transfer][country]", "FR");
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "eur");
  params.set("line_items[0][price_data][unit_amount]", String(amount * 100));

  const productName = isCreation ? `Création de site web — ${model}` : service === "Mise à jour iOS / macOS" ? (device === "ebagzunlock " ? "ebagzunlock " : `Mise à jour ${UPDATE_SYSTEMS[device]} — ${device} — ${model}`) : `${service} — ${device} — ${model}`;
  params.set("line_items[0][price_data][product_data][name]", productName);
  params.set("line_items[0][price_data][product_data][description]", "Prestation réalisée uniquement dans un cadre légal, avec l'autorisation du propriétaire.");
  params.set("billing_address_collection", "auto");
  params.set("return_url", `${siteOrigin}/confirmation.html?session_id={CHECKOUT_SESSION_ID}`);

  const metadata = { order_number: orderNumber, service, device: device || "", model: model || "", activity_domain: isCreation ? model : "", amount_eur: String(amount), customer_name: name, customer_email: email, customer_phone: phone, customer_identifier: identifier, customer_message: message, consent_accepted: "yes" };
  for (const [key, value] of Object.entries(metadata)) params.set(`metadata[${key}]`, value);

  try {
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded", "Stripe-Version": "2026-09-30.endive" },
      body: params
    });
    const session = await stripeResponse.json();
    if (!stripeResponse.ok) {
      console.error("Stripe error:", session);
      return Response.json({ error: "Stripe n'a pas pu créer le paiement." }, { status: 502 });
    }
    return Response.json({ client_secret: session.client_secret });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: "Impossible de contacter Stripe." }, { status: 502 });
  }
}
