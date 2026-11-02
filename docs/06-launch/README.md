# Préparation du lancement Play Store

Documents préparés pour les points 6 à 10 de la to-do list de lancement (session du 2026-07-28). Chacun est rédigé à partir du comportement réel de l'app, pas de texte générique — mais **aucun n'est un avis juridique**, une relecture reste recommandée sur les deux textes légaux avant publication.

| Fichier | Point | Statut |
|---|---|---|
| [`terms-of-use.md`](./terms-of-use.md) | #6 — CGU définitives | **Publiées** : https://yponceco2499.github.io/safety-doggy/terms.html |
| [`privacy-policy.md`](./privacy-policy.md) | #6 — Politique de confidentialité définitive | **Publiée** : https://yponceco2499.github.io/safety-doggy/privacy.html — complète |
| [`store-listing.md`](./store-listing.md) | #7 — Description + captures d'écran | Textes prêts ; captures d'écran **à faire vous-même** depuis un vrai appareil (liste précise fournie) |
| [`content-rating-questionnaire.md`](./content-rating-questionnaire.md) | #8 — Classification du contenu | Réponses préparées, à cliquer directement dans Play Console |
| [`data-safety-form.md`](./data-safety-form.md) | #9 — Sécurité des données | Contenu prêt et complet : `delete-account` déployée le 2026-08-22 |
| [`background-location-declaration.md`](./background-location-declaration.md) | #10 — Déclaration localisation arrière-plan | Texte FR + EN prêt ; déclenche un examen Google séparé, à soumettre tôt |

## Hébergement public des CGU / politique de confidentialité

Publiées via GitHub Pages, sur une branche orpheline dédiée `gh-pages` contenant uniquement les 3 pages publiques (`index.html`, `terms.html`, `privacy.html`) — le reste du dépôt (`docs/`, code source) n'est **pas** exposé par ce site, contrairement à un Pages pointé sur `/docs` de `main`.

- Accueil : https://yponceco2499.github.io/safety-doggy/
- CGU : https://yponceco2499.github.io/safety-doggy/terms.html
- Politique de confidentialité : https://yponceco2499.github.io/safety-doggy/privacy.html

Ces URLs sont celles à saisir dans Play Console (fiche Store + formulaire Data Safety). Le contenu HTML est une copie mise en forme de `terms-of-use.md` / `privacy-policy.md` — **toute modification future doit être répercutée dans les deux endroits** (le `.md` ici, le `.html` sur la branche `gh-pages`).

## État technique avant le premier envoi sur Play Console (2026-09-20)

- **Identifiant Android** : `app.safetypet` (définitif une fois publié). Builds via EAS : profil `preview` (APK installable directement, pour tester) et `production` (AAB, à envoyer sur Play Console) — construits sur le même commit.
- **Emails** : envoyés via Resend depuis `noreply@safetypet.app` (domaine vérifié). L'inscription et la réinitialisation de mot de passe utilisent un **code à 6 chiffres saisi dans l'app**, pas un lien (les liens passaient par un navigateur puis un lien profond, chaîne peu fiable sur Android).
- **Suppression de compte** : déployée et testée de bout en bout.
- **Écrans légaux dans l'app** : résumé + lien vers les textes complets publiés (plus de mention « texte provisoire »).

### Sécurité de la clé Google Maps

Le dépôt GitHub est public (condition pour publier des pages GitHub gratuitement), donc la clé dans `mobile/app.json` est visible par n'importe qui. Ce n'est un problème que si la clé n'est pas restreinte : une clé Android correctement restreinte (package + empreinte(s) SHA-1) ne peut être utilisée que par l'app elle-même, même si sa valeur est publique.

**À faire (identifiée le 2026-11-02) :** restreindre la clé dans Google Cloud Console > Identifiants, à l'API « Maps SDK for Android », avec package `app.safetypet` et l'empreinte SHA-1 de la clé de signature EAS : `65:48:9D:34:B0:9F:54:BF:0B:C4:9B:2F:82:48:88:E0:60:3E:99:87` (récupérée via l'API GraphQL EAS, `androidKeystore.sha1CertificateFingerprint`). Action côté Google Cloud Console, pas de dépôt de code — à faire directement dans la console.

### À faire après le tout premier envoi sur Play Console

- **Ajouter une deuxième empreinte SHA-1 à la clé Google Maps** : avec « Play App Signing » (configuration standard), les apps installées depuis le Play Store sont re-signées par une clé Google différente de la clé d'envoi EAS déjà restreinte ci-dessus. Visible dans Play Console > Configuration > Intégrité de l'application, une fois le premier `.aab` envoyé. Sans cette deuxième empreinte, la carte serait blanche pour les utilisateurs installant depuis le Store (le build de test EAS, lui, continuera de fonctionner avec la première empreinte).
- **Déclaration des services de premier plan** (permission de localisation en arrière-plan) : si Play Console la demande, réutiliser le texte de `background-location-declaration.md`.
- **Identité de l'éditeur** dans les CGU et la politique de confidentialité : remplacer « SafetyPet » par les noms réels des éditeurs (personnes physiques tant qu'aucune société n'existe) ; à répercuter aussi sur la page publiée (`gh-pages`).

## Ce qui reste hors de portée de ces documents

- **Captures d'écran et vidéo** — nécessitent un appareil réel, non générables ici.
- **Le formulaire Play Console lui-même** — ces documents préparent les réponses, mais le remplissage se fait dans l'interface Google.
