# SafetyPet — Déclaration Google Play : permission de localisation en arrière-plan

L'app demande `ACCESS_BACKGROUND_LOCATION` (voir `mobile/app.json`, plugin `expo-location`) pour la fonctionnalité optionnelle de suivi de distance des sorties. Google exige une déclaration spécifique et un examen renforcé pour toute app utilisant cette permission (Policy > App content > Sensitive app permissions, ou formulaire dédié selon l'interface). Ce document prépare le texte à soumettre — **à copier-coller en anglais si le formulaire l'exige**, une version française est fournie pour relecture.

---

## Texte à soumettre (anglais — format généralement attendu par le formulaire)

> SafetyPet lets dog owners optionally track the distance walked during a session ("Mes sorties" / "My walks" feature). This requires location access to continue while the screen is locked or the app is in the background — otherwise the distance would stop being measured the moment the user puts their phone away, which defeats the purpose of tracking a walk.
>
> This is strictly opt-in per session: background tracking only starts after the user (1) explicitly enables a toggle before starting a walk, and (2) accepts a dedicated in-app consent screen explaining exactly what is tracked and why, shown before the very first tracked walk. Declining is always possible and never blocks using the app or the walk-tracking feature in its non-GPS "light" version (manual start/stop, no location involved).
>
> A persistent Android foreground-service notification stays visible for the entire duration of a tracked walk, so tracking is never silent.
>
> Only the final computed distance is stored once the walk ends — individual GPS points are used to update a running total on-device and are then discarded, never transmitted to our servers or stored as a route/path. Location data is never used for advertising, analytics, or any purpose unrelated to this single feature.

## Version française (relecture)

> SafetyPet permet aux propriétaires de chiens de suivre, de façon optionnelle, la distance parcourue pendant une sortie ("Mes sorties"). Cela nécessite un accès à la position qui continue même écran verrouillé ou application en arrière-plan — sinon la distance s'arrêterait d'être mesurée dès que l'utilisateur range son téléphone, ce qui viderait la fonctionnalité de son sens.
>
> C'est strictement optionnel, activé sortie par sortie : le suivi en arrière-plan ne démarre qu'après que l'utilisateur (1) active explicitement un interrupteur avant de démarrer une sortie, et (2) accepte un écran de consentement dédié expliquant précisément ce qui est suivi et pourquoi, affiché avant la toute première sortie suivie. Refuser reste toujours possible et ne bloque jamais l'usage de l'app ni la fonctionnalité "Sorties" dans sa version légère (démarrage/arrêt manuel, sans position).
>
> Une notification persistante de service en avant-plan Android reste visible pendant toute la durée d'une sortie suivie — le suivi n'est donc jamais silencieux.
>
> Seule la distance totale calculée est enregistrée à la fin de la sortie — les positions individuelles servent uniquement, sur l'appareil, à mettre à jour un total, puis sont immédiatement écartées : jamais transmises à nos serveurs, jamais stockées sous forme de trajet. La position n'est jamais utilisée à des fins publicitaires, d'analyse comportementale, ou pour tout autre usage que cette unique fonctionnalité.

---

## Éléments que Google peut demander en complément

- **Capture d'écran ou courte vidéo** montrant l'écran de consentement avant activation du suivi, et le switch d'activation dans "Mes sorties" — à fournir depuis un vrai appareil (voir `docs/06-launch/store-listing.md` pour la liste des captures à préparer).
- **Lien vers la politique de confidentialité publique** (voir `docs/06-launch/privacy-policy.md`, §4 traite spécifiquement de ce cas) — le formulaire demande généralement l'URL, pas le texte brut.

## Point d'attention

Ce formulaire déclenche un **examen manuel par Google**, distinct de la revue standard de l'app, qui peut ajouter plusieurs jours au délai de publication — à soumettre le plus tôt possible dans le calendrier de lancement, en parallèle du reste.
