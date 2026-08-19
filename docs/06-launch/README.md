# Préparation du lancement Play Store

Documents préparés pour les points 6 à 10 de la to-do list de lancement (session du 2026-07-28). Chacun est rédigé à partir du comportement réel de l'app, pas de texte générique — mais **aucun n'est un avis juridique**, une relecture reste recommandée sur les deux textes légaux avant publication.

| Fichier | Point | Statut |
|---|---|---|
| [`terms-of-use.md`](./terms-of-use.md) | #6 — CGU définitives | **Publiées** : https://yponceco2499.github.io/safety-doggy/terms.html |
| [`privacy-policy.md`](./privacy-policy.md) | #6 — Politique de confidentialité définitive | **Publiée** : https://yponceco2499.github.io/safety-doggy/privacy.html (1 point à compléter : région d'hébergement Supabase, §6) |
| [`store-listing.md`](./store-listing.md) | #7 — Description + captures d'écran | Textes prêts ; captures d'écran **à faire vous-même** depuis un vrai appareil (liste précise fournie) |
| [`content-rating-questionnaire.md`](./content-rating-questionnaire.md) | #8 — Classification du contenu | Réponses préparées, à cliquer directement dans Play Console |
| [`data-safety-form.md`](./data-safety-form.md) | #9 — Sécurité des données | Contenu prêt à transcrire, 2 points à vérifier listés en bas du fichier |
| [`background-location-declaration.md`](./background-location-declaration.md) | #10 — Déclaration localisation arrière-plan | Texte FR + EN prêt ; déclenche un examen Google séparé, à soumettre tôt |

## Hébergement public des CGU / politique de confidentialité

Publiées via GitHub Pages, sur une branche orpheline dédiée `gh-pages` contenant uniquement les 3 pages publiques (`index.html`, `terms.html`, `privacy.html`) — le reste du dépôt (`docs/`, code source) n'est **pas** exposé par ce site, contrairement à un Pages pointé sur `/docs` de `main`.

- Accueil : https://yponceco2499.github.io/safety-doggy/
- CGU : https://yponceco2499.github.io/safety-doggy/terms.html
- Politique de confidentialité : https://yponceco2499.github.io/safety-doggy/privacy.html

Ces URLs sont celles à saisir dans Play Console (fiche Store + formulaire Data Safety). Le contenu HTML est une copie mise en forme de `terms-of-use.md` / `privacy-policy.md` — **toute modification future doit être répercutée dans les deux endroits** (le `.md` ici, le `.html` sur la branche `gh-pages`).

## Ce qui reste hors de portée de ces documents

- **Captures d'écran et vidéo** — nécessitent un appareil réel, non générables ici.
- **Le formulaire Play Console lui-même** — ces documents préparent les réponses, mais le remplissage se fait dans l'interface Google.
