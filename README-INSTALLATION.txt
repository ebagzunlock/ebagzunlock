# ebagzunlock — Intégration Stripe Checkout / Netlify

Cette version conserve le site d'origine, active les boutons de paiement des 10 tarifs et ajoute une fonction Netlify qui crée une session Stripe Checkout.

## Tarifs intégrés
- iPhone X – iPhone 12 Pro : 38.00 €
- iPhone 12 Pro Max – iPhone 14 : 55.00 €
- iPhone 14 Plus – iPhone 15 : 60.00 €
- iPhone 15 Plus – iPhone 16 : 67.00 €
- iPhone 16 Plus – iPhone 16e : 71.00 €
- iPhone 17 – iPhone 17e : 115.00 €
- iPhone 18 Pro : 135.00 €
- iPhone 18 Pro Max : 155.00 €
- iPhone Duo : 132.50 €
- iPhone 17 Air : 119.50 €

## Configuration obligatoire

1. Dans Netlify, ouvrez le projet du site ebagzunlock.
2. Allez dans **Project configuration → Environment variables**.
3. Ajoutez `STRIPE_SECRET_KEY` avec la clé secrète Stripe du compte français.
   - Pour les tests, utilisez la clé `sk_test_...`.
   - Pour les paiements réels, utilisez la clé `sk_live_...` uniquement après avoir effectué des tests.
   - Ne mettez jamais cette clé dans `index.html`, dans un dépôt public ou dans une variable `NEXT_PUBLIC_` / `VITE_`.
4. Vérifiez que la variable est accessible aux **Functions**.
5. Déployez à nouveau le site après avoir ajouté/modifié la variable.

La fonction utilise l'URL du site fournie par Netlify (`URL`) pour les adresses de retour.

## Déploiement

Téléversez le contenu de ce dossier comme racine du site Netlify, ou poussez-le dans le dépôt Git déjà connecté au site. Netlify publie le dossier `public/` (qui contient `index.html` et les pages de retour) et détecte `netlify/functions/create-checkout-session.mjs`. Le dossier `netlify/` reste hors du dossier public.

Pour tester en local :
```bash
npm install
npx netlify dev
```

## Test recommandé

1. Commencez avec `sk_test_...`.
2. Faites un paiement de test depuis chaque bouton.
3. Vérifiez dans Stripe Dashboard → Developers → Events / Payments que la session est créée et que le paiement test apparaît.
4. Vérifiez les pages de retour et le parcours mobile.
5. Passez en `sk_live_...` seulement après validation.

## Important — confirmation et traitement de la commande

La page `paiement-reussi.html` est une page de retour visuelle ; elle ne constitue pas à elle seule une preuve de paiement. Avant d'automatiser une prestation, ajoutez un webhook Stripe vérifiant la signature `Stripe-Signature` et traitez uniquement l'événement `checkout.session.completed` (et, si nécessaire, `checkout.session.async_payment_succeeded`). Ne lancez jamais une prestation sur la seule base de l'URL de retour.

Le catalogue et les montants sont contrôlés côté serveur : le navigateur transmet uniquement l'identifiant fixe de la prestation, jamais le montant.

Les prestations doivent rester limitées au désimlockage opérateur autorisé, sur un appareil appartenant au client ou pour lequel il détient une autorisation. Conservez des descriptions exactes, vos conditions de vente, politique de remboursement et coordonnées de contact à jour.
Test Stripe - branche de test
