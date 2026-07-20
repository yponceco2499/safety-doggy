# Safety Doggy — Propositions d'amélioration (post-MVP)

**Objet :** analyse et priorisation des 11 idées soumises par les porteurs de projet, avec pour chacune une proposition affinée, une note d'intérêt, un niveau de difficulté, et une recommandation de séquencement.

**Méthode de notation :**
- **Intérêt /5** — valeur attendue pour l'utilisateur et pour l'app (rétention, différenciation, demande réelle).
- **Difficulté /5** — effort de développement **et** risque (technique, RGPD, modération) dans l'architecture actuelle (Expo/React Native + Supabase, budget zéro, équipe de 2 personnes sans capacité de modération dédiée).
- **Priorité** — P1 (à faire en premier), P2 (valable mais attend une étape), P3 (à discuter avant de s'engager).

Chaque idée est évaluée par rapport aux décisions déjà actées dans `docs/01-product-documentation/safety-doggy-product-specification.md` — plusieurs d'entre elles entrent en tension directe avec des choix de conception délibérés (anonymat, pas de texte libre, durées fixes). Ce n'est pas un veto : c'est un signal à trancher consciemment plutôt qu'à contourner sans y penser.

---

## Tableau de synthèse

| # | Proposition | Intérêt /5 | Difficulté /5 | Priorité |
|---|---|---|---|---|
| 4 | Élargir la liste de dangers | 5 | 1 | **P1** |
| 8 | Restau & autres pet-friendly (comme type de signalement) | 4 | 2 | **P1** |
| 6a | Q&A — FAQ statique | 3 | 1 | **P1** |
| 1 | Choix de ville | 5 | 3 | **P1** *(après validation MVP Le Havre)* |
| 9 | Vétérinaires (comme type de signalement) | 3 | 2 | P2 |
| 10 | Photos sur un signalement | 3 | 3 | P2 |
| 2 | Choisir l'animal que tu balades | 3 | 2 | P2 |
| 5 | Stats (sorties, km) | 4 | 4 | P2 |
| 11 | Délai d'affichage (durées ajustables par les porteurs) | 2 | 1–2 | P3 *(clarifier l'intention)* |
| 6b | Q&A — forum communautaire | 2 | 4 | P3 |
| 7 | Chatbot | 2 | 4 | P3 |
| 3 | Demandes d'amis entre utilisateurs | 2 | 4 | P3 *(décision stratégique, pas juste une feature)* |

---

## P1 — À faire en premier (gains rapides, aucun conflit de conception)

### 4. Élargir la liste de dangers
**Idée initiale :** ajouter plus de types de danger.

**Proposition affinée :** l'architecture est déjà prête pour ça — `mobile/src/constants/report-types.ts` est un tableau unique, et le lien "Suggérer un nouveau type" (mailto) existe déjà dans l'écran de création pour collecter les demandes. Pas besoin de plus d'ingénierie : une fois qu'un volume suffisant de suggestions arrive, ajouter un type = une ligne dans ce fichier (icône, couleur, catégorie, durée) + traduction, à répercuter dans `docs/01-product-documentation/safety-doggy-product-specification.md` §4.2.

**Intérêt : 5/5** — Renforce directement la valeur centrale de l'app.
**Difficulté : 1/5** — Trivial avec l'architecture actuelle.

---

### 8. Restau & autres lieux pet-friendly
**Idée initiale :** ajouter les restaurants et lieux pet-friendly.

**Proposition affinée :** ne pas construire un annuaire à part (adresses, horaires, vérification) — ça devient un produit différent, avec une charge de maintenance de données que 2 personnes ne peuvent pas tenir. Le plus efficace : un nouveau type de signalement positif (comme `dog_friendly` déjà existant), signalé par la communauté au même titre qu'un point d'eau ou une zone sans laisse. Même mécanique, même durée "permanente".

**Intérêt : 4/5**
**Difficulté : 2/5** — Même patron que #4, juste une nouvelle entrée dans `report-types.ts`.

---

### 6a. Q&A — FAQ statique
**Idée initiale :** Q&A.

**Proposition affinée :** avant d'envisager un vrai forum communautaire (voir #6b plus bas, nettement plus risqué), commencer par une simple page FAQ statique dans le profil (pourquoi 16 ans minimum, pourquoi pas de texte libre, comment fonctionne l'expiration, etc.) — répond à la majorité des questions réelles des utilisateurs pour un coût de développement quasi nul.

**Intérêt : 3/5**
**Difficulté : 1/5** — Un écran de texte statique, sur le modèle de `terms.tsx`/`privacy.tsx` déjà construits.

---

### 1. Choix de ville
**Idée initiale :** pouvoir choisir sa ville.

**Proposition affinée :** c'est le mécanisme naturel pour sortir du Havre, mais **ce n'est pas une simple feature technique — c'est littéralement le critère de passage en V2** déjà défini dans la spec (§8.3 : la V2 ne se lance que si les indicateurs d'usage du MVP Le Havre sont validés). Construire le multi-ville maintenant reviendrait à contourner la méthode déjà actée avec vous.

Techniquement, plutôt qu'un système "n'importe quelle ville au monde" (charge de modération/densité communautaire ingérable pour une petite équipe), prévoir une **liste courte de zones de lancement configurées** (nom, centre GPS, rayon), avec un sélecteur au premier lancement. Remplace le `DEFAULT_REGION` actuellement codé en dur sur Le Havre par une liste extensible.

**Intérêt : 5/5** — C'est le chemin de croissance de l'app.
**Difficulté : 3/5** — Pas de nouvelle table nécessaire, mais touche la logique de détection de doublons et de zone autorisée (`report-create.tsx`).
**Priorité : P1, mais séquencé après la validation MVP** — ne pas commencer avant que les critères §8.3 soient remplis.

---

## P2 — Valables, mais avec un coût ou une dépendance

### 9. Vétérinaires
Même raisonnement que #8 : comme type de signalement/point d'intérêt plutôt que comme annuaire complet (horaires, urgences, avis) — pour ça, un lien vers Google Maps fait déjà le travail mieux qu'une base de données maison.

**Intérêt : 3/5** · **Difficulté : 2/5**

---

### 10. Ajouter des photos (sur un signalement)
**Idée initiale :** ajouter des photos lors de la notif.

**Clarification :** interprété comme "photo jointe à un signalement" — c'est déjà identifié dans la spec (§9.2, fonctionnalité réputation V2), pas une idée nouvelle.

**Pourquoi ce n'était pas au MVP :** une photo porte exactement le même risque que le texte libre qu'on a volontairement exclu (§4.5) — contenu inapproprié, aucune vérification, équipe de 2 personnes sans outil de modération. C'est la raison pour laquelle ça avait été repoussé.

**Ce qui a changé depuis :** le système de signalement "incorrect" avec suppression automatique à 4 signalements (`supabase/002_flag_threshold.sql`) construit dans cette session réduit une partie de ce risque — il existe maintenant un filet de sécurité qui n'existait pas au moment de la décision initiale. Ça rend cette feature plus raisonnable qu'avant, sans éliminer le risque totalement.

**Précision du 2026-07-16 (confirmée par les porteurs de projet) : la photo doit être facultative, jamais bloquante.** Un utilisateur doit pouvoir publier un signalement sans photo exactement comme aujourd'hui — l'ajout d'une photo est une option en plus, pas une nouvelle étape obligatoire du parcours de création. À implémenter avec un champ `photo_url` nullable sur `reports` et un bouton "Ajouter une photo (optionnel)" dans `report-create.tsx`, sans jamais désactiver le bouton "Publier" en son absence.

**Intérêt : 3/5** · **Difficulté : 3/5** — Nécessite un bucket Supabase Storage + upload UI + décision consciente sur la modération.

---

### 2. Choisir l'animal que tu balades
**Proposition affinée :** un profil "mes chiens" optionnel dans l'écran Profil (nom, race facultative, photo facultative) — **usage strictement personnel**, jamais rattaché publiquement à un signalement (la règle de contenu anonyme du §4.2/§4.4 reste intacte : un signalement ne doit jamais identifier un animal précis).

**Intérêt : 3/5** — Agréable, mais sa vraie valeur ne se révèle qu'associée aux Stats (#5) : "3 sorties avec Rex cette semaine" est plus parlant que juste "3 sorties".
**Difficulté : 2/5** — Nouvelle table `pets`, RLS simple (propriétaire uniquement).
**Recommandation :** grouper avec #5, pas la peine de la livrer seule.

---

### 5. Stats (nb. de sorties, kilomètres, etc.)
**Ce n'est pas une idée nouvelle** — déjà scopée en V2 dans la spec ("Walk history — opt-in GPS trace recording... Requires explicit GDPR consent").

**Proposition affinée :** ne pas construire directement le tracking GPS en arrière-plan (le plus coûteux en complexité, en consommation batterie, et en risque RGPD). Commencer par une version "session explicite" : l'utilisateur appuie sur "Démarrer une sortie" / "Terminer", et seule cette fenêtre est trackée pour calculer la distance. Le simple compteur "nombre de sorties" est presque gratuit dès qu'on a ce bouton start/stop, sans même avoir besoin du calcul de distance.

**Intérêt : 4/5** — Bon levier de rétention.
**Difficulté : 4/5** en version complète (tracking continu + consentement RGPD dédié) ; **2-3/5** en version "session explicite" ci-dessus.
**Recommandation :** commencer par la version légère, pas le tracking continu.

---

## P3 — À clarifier ou trancher explicitement avant de construire

### 11. Délai d'affichage
**Ambiguïté à lever avec vous avant de coder quoi que ce soit** — deux interprétations possibles :

- **(a) Durée pendant laquelle un signalement reste visible** (les `durationHours` fixes dans `report-types.ts`, ex. 4h pour une chasse, 7 jours pour les chenilles). Ces durées sont **volontairement non modifiables par l'utilisateur** à la création (spec §4.5) — c'est une protection anti-abus délibérée (empêcher quelqu'un de garder un signalement "actif" plus longtemps que justifié). Rendre ça éditable par l'utilisateur annulerait cette protection.
  → **Version sûre** : garder les durées fixes pour l'utilisateur, mais les rendre ajustables **par vous** (porteurs de projet) via un fichier de config, si le retour terrain montre qu'une durée est mal calibrée (ex. "chasse en cours" trop courte). C'est un changement de config, pas une feature utilisateur.
- **(b) Délai avant qu'un signalement apparaisse chez les autres utilisateurs** (latence réseau) — déjà quasi temps réel via Supabase Realtime, donc probablement déjà résolu si c'est le sens visé.

**Intérêt : 2/5** · **Difficulté : 1-2/5** (version sûre) · **Recommandation : clarifier l'intention avec vous avant de développer.**

---

### 6b. Q&A — forum communautaire
Si l'idée derrière "Q&A" est en fait un espace où les utilisateurs posent des questions et se répondent entre eux (plutôt qu'une FAQ statique, voir #6a), ça **réintroduit exactement le risque de modération de texte libre** que la spec a explicitement écarté pour les signalements (§4.5 : "le plus grand risque de modération et juridique de toute l'app"). Pour une équipe de 2 personnes sans outil de modération dédié, un forum ouvert est un vrai risque, pas juste une feature.

**Intérêt : 2/5** · **Difficulté : 4/5** · **Recommandation : ne pas construire avant d'avoir une vraie capacité de modération (rejoint la "moderation dashboard" déjà en V2, §9.2).**

---

### 7. Chatbot
**À clarifier avant tout :** un chatbot pour faire quoi précisément ? Assistant FAQ ? Aide au choix du type de signalement ? La FAQ statique (#6a) et la grille d'icônes déjà construite couvrent déjà l'essentiel de ces besoins pour un coût nettement inférieur.

**Point de friction budgétaire :** la spec pose comme contrainte non négociable un **budget récurrent zéro** (§5.1). Un chatbot basé sur une API LLM a un coût d'usage récurrent (même les paliers gratuits ont des limites qui sautent vite avec de l'usage réel) — ça romprait cette contrainte sans une décision explicite de votre part pour l'accepter.

**Intérêt : 2/5** — Séduisant sur le papier, mais largement remplaçable par une UI statique moins chère.
**Difficulté : 4/5** — Intégration + gestion des coûts + garde-fous contre les abus/détournements du bot.
**Recommandation : à ne reconsidérer que si les données d'usage montrent un vrai besoin non couvert par la FAQ.**

---

### 3. Demandes d'amis entre utilisateurs
**Le point le plus important du document.** Cette idée entre en **conflit direct** avec deux décisions de conception déjà actées et implémentées :

1. **Signalements anonymes** (§4.4) — aucune identité n'est jamais affichée publiquement, précisément pour maximiser la contribution et éviter que les gens hésitent à signaler par peur d'exposition.
2. **Aucune visibilité de localisation entre utilisateurs** (§4.1, ajouté explicitement le 2026-07-16) — "no user-to-user location visibility... no 'nearby users' feature."

Un système d'amis implique presque toujours des identités visibles et, souvent, une notion de présence/proximité — exactement ce que ces deux règles excluent. Ce n'est pas un simple ticket de développement : **c'est un changement de positionnement produit**, d'un outil de sécurité communautaire façon Waze vers quelque chose qui se rapproche d'un réseau social, avec les risques qui vont avec (harcèlement, pression à l'identité réelle, traçage).

**Alternative qui capture une partie de la valeur sans le risque :** un simple **partage de signalement** via le partage natif du téléphone (envoyer le lien d'un signalement précis à qui on veut, par SMS/WhatsApp/etc.) — donne le "je préviens quelqu'un que je connais" sans construire de graphe social, de liste de followers, ni de système de présence.

**Intérêt : 2/5** — Demande réelle des utilisateurs, mais en tension frontale avec le positionnement "sécurité" de l'app.
**Difficulté : 4/5** — Nouveau modèle de données (demandes, statuts accepté/bloqué), notifications, réglages de confidentialité, modération des abus (harcèlement via le système lui-même).
**Recommandation : ne pas trancher seul — c'est une décision stratégique à prendre consciemment avec vous, pas une feature à ajouter au fil de l'eau.**

---

## Recommandation de séquencement global

1. **Maintenant / prochain sprint** — #4, #8, #6a : gains rapides, zéro conflit, renforcent le cœur de l'app.
2. **Après validation des critères MVP Le Havre (§8.3)** — #1 (choix de ville).
3. **Ensuite, au fil de l'eau** — #9, #10, #2+#5 (groupés), selon la bande passante disponible.
4. **À ne pas construire sans décision explicite de votre part** — #3, #6b, #7, et la version "utilisateur" de #11 : chacune touche soit au budget récurrent, soit à la capacité de modération, soit au positionnement anonymat/sécurité de l'app — des lignes que la spec a délibérément tracées.
