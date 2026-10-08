# Déployer le portfolio : Vercel (gratuit) + domaine OVHcloud

> Les prix OVH changent souvent (promos la 1re année). Vérifie toujours le panier sur
> https://www.ovhcloud.com/fr/domains/ avant de payer. Les cases "non vérifié" n'ont pas pu être confirmées en euros (le site OVH n'était pas accessible depuis l'environnement de recherche).

## 1. Coût (par an)

| Extension | 1re année | Renouvellement | Source / statut |
|---|---|---|---|
| .com | 7,99 € HT | 13,49 € HT | article tiers citant la grille OVH (juillet 2026) |
| .fr | 4,99 € HT | 7,79 € HT | idem |
| .io | 30,99 € HT (promo) | 59,74 € HT | idem (cher, déconseillé) |
| .dev | non vérifié en € | non vérifié en € | pages EN OVH : ~13,19 $ (promo 9,84 $), renouv. ~17,19 $ |
| .me | non vérifié en € | non vérifié en € | pages EN OVH : ~8,89 $, renouv. ~22,19 $ |
| .net | non vérifié | non vérifié | ancien forum OVH : renouv. ~12,99-16,49 € HT |

- Prix en € HT : ajouter la TVA 20 % pour le TTC (ex. .com 1re année ~9,59 € TTC, .fr ~5,99 € TTC).
- DNS : la zone DNS OVH est utilisable avec le domaine (inclus). WHOIS privé / redirections e-mail : OVH propose l'anonymisation des données et des redirections e-mail, mais l'inclusion exacte sans surcoût n'a pas pu être revérifiée ; contrôle dans le panier. Pour un .fr, les données perso des particuliers sont masquées par défaut (règle AFNIC).
- Hébergement web OVH (https://www.ovhcloud.com/fr/web-hosting/) : prix non vérifié. **Inutile ici** : Vercel héberge gratuitement le site React.

## 2. Vercel Hobby (gratuit)

- Domaine personnalisé : autorisé.
- Limites indicatives (page https://vercel.com/docs/limits) : 100 Go de Fast Data Transfer/mois, largement suffisant pour un portfolio. Re-vérifier la page.
- Usage non commercial uniquement (portfolio perso OK).

## 3. Pas à pas

1. **Acheter** : https://www.ovhcloud.com/fr/domains/ -> chercher le nom -> choisir `.fr` ou `.com` -> commander (compte OVH, paiement).
2. **Ajouter à Vercel** : projet -> Settings -> Domains -> Add `monnom.fr` (et `www.monnom.fr`). Vercel affiche les enregistrements exacts à créer ; **fais confiance à cet écran**.
3. **DNS chez OVH** : Manager OVH -> Noms de domaine -> ton domaine -> onglet "Zone DNS" -> supprimer les anciens A/AAAA/CNAME `@` et `www` par défaut, puis ajouter :
   - `@` type **A** -> `76.76.21.21`
   - `www` type **CNAME** -> valeur donnée par Vercel (générique : `cname.vercel-dns.com` ; les docs récentes indiquent aussi `cname.vercel-dns-0.com`) avec un point final si OVH le demande.
   - Ne laisse aucun enregistrement AAAA sur `@`.
4. **HTTPS** : automatique (Let's Encrypt via Vercel) une fois le DNS propagé (minutes à 24 h). Statut "Valid Configuration" dans Vercel. Active la redirection www <-> apex.

## 4. Astuce : e-mail gratuit

Dans le Manager OVH -> ton domaine -> onglet "Redirections e-mail" : créer `contact@monnom.fr` -> redirige vers ton Gmail. Pas de boîte payante nécessaire. (Attention aux MX : ne les supprime pas.) Pour répondre depuis cette adresse, utilise "Envoyer en tant que" dans Gmail.

## 5. Budget conseillé

- Année 1 : ~6 à 10 € TTC (.fr ou .com) + 0 € Vercel + 0 € e-mail = **~6-10 €**.
- Années suivantes : ~9 € TTC (.fr) à ~16 € TTC (.com).
- Éviter .io (~60 € HT/an en renouvellement).

## Sources

- https://www.ovhcloud.com/fr/domains/
- https://www.ovhcloud.com/en/domains/tld/com/
- https://www.ovhcloud.com/fr/web-hosting/
- https://community.ovhcloud.com/t/cout-de-renouvellement-des-net-et-des-com/20707
- https://www.lafabriquedunet.fr/logiciels/tendances/quel-est-le-prix-dun-nom-de-domaine
- https://vercel.com/docs/domains/set-up-custom-domain
- https://vercel.com/docs/limits
