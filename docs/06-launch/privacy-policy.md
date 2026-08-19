# SafetyPet — Politique de confidentialité

**Statut : projet de texte définitif, prêt à publier après relecture.** Rédigé à partir du schéma de données réel de l'app (session de développement du 2026-07-28), pas un avis juridique — mais chaque section ci-dessous correspond exactement à ce que le code fait, pas à une intention générique. Une relecture juridique reste recommandée avant publication, notamment sur le §6 (sous-traitants) une fois la région d'hébergement Supabase confirmée.

*Dernière mise à jour : 22 août 2026*

---

## 1. Qui sommes-nous

SafetyPet est éditée par SafetyPet, joignable à **contact@safetypet.app**.

## 2. Données que nous collectons

| Donnée | Quand | Obligatoire ? |
|---|---|---|
| Email | Création de compte | Oui |
| Mot de passe (stocké de façon chiffrée par notre prestataire d'authentification, jamais en clair) | Création de compte | Oui |
| Pseudo | Généré automatiquement à l'inscription, modifiable ensuite | — |
| Photo de profil | Profil | Non, facultatif |
| Position géographique (ponctuelle) | Centrage de la carte, création d'un signalement | Non — l'app fonctionne sans, en mode dégradé |
| Position géographique (en continu, y compris écran verrouillé) | Uniquement si vous activez le suivi de distance sur une sortie | Non — nécessite un consentement explicite séparé, voir §4 |
| Contenu d'un signalement (type, catégorie, position, photo facultative) | Création d'un signalement | Le type et la position sont requis ; la photo est facultative |
| Informations sur vos chiens (nom, race, date de naissance, n° puce, date de vaccin) | Profil "Mes chiens" | Facultatif, usage strictement personnel |
| Historique de vos sorties (heure de début/fin, distance si suivi activé) | Fonctionnalité "Mes sorties" | Facultatif |
| Adresse recherchée sur la carte | Recherche d'adresse | Transmise à un service tiers de géocodage, voir §6 |

**Nous ne collectons jamais** : de contenu de texte libre associé à un signalement, de numéro de téléphone, d'informations de paiement, de données de contacts, de données publicitaires.

## 3. Pourquoi nous utilisons ces données

- **Email/mot de passe** : authentification, sécurisation et responsabilisation des signalements (limite anti-abus, contact en cas de litige).
- **Position ponctuelle** : afficher la carte centrée sur vous et pré-remplir la position d'un signalement.
- **Position en continu (sorties)** : calculer, sur l'appareil, la distance parcourue pendant une sortie que vous avez explicitement choisi de suivre.
- **Contenu des signalements** : le service lui-même — informer la communauté.
- **Informations sur vos chiens** : usage personnel uniquement (fiche d'identité, rappel de vaccin) — jamais utilisées à d'autres fins, jamais partagées publiquement.

## 4. Suivi de position pendant une sortie — traitement particulier

Cette fonctionnalité est **désactivée par défaut**. Avant toute activation :

- un écran dédié explique précisément ce qui est suivi et pourquoi ;
- votre accord explicite est enregistré (horodatage) ;
- vous pouvez refuser sans que cela vous empêche d'utiliser la fonctionnalité "Sorties" en version simple (sans distance).

**Minimisation des données :** seule la distance totale calculée est enregistrée à la fin de la sortie. Les positions individuelles relevées pendant la sortie ne sont jamais transmises à nos serveurs ni stockées — elles servent uniquement, sur votre appareil, à calculer ce total, puis sont immédiatement écartées.

## 5. Anonymat des signalements

Un signalement n'affiche jamais l'identité de son créateur, à aucun autre utilisateur. Aucune fonctionnalité de l'application ne permet à un utilisateur de voir la position, en temps réel ou passée, d'un autre utilisateur.

## 6. Partage avec des tiers

Nous ne vendons ni ne louons vos données. Elles sont partagées uniquement avec les prestataires techniques strictement nécessaires au fonctionnement du service :

| Prestataire | Rôle | Données concernées |
|---|---|---|
| Supabase | Hébergement de la base de données, authentification, stockage des photos | L'ensemble des données ci-dessus |
| OpenStreetMap / Nominatim | Fond de carte, recherche d'adresse | Le texte de votre recherche d'adresse (aucune autre donnée personnelle) |

Aucun outil publicitaire ou d'analyse comportementale tiers n'est intégré à l'application.

Le projet Supabase est hébergé dans la région **Union européenne (West EU — Irlande, eu-west-1)**. Vos données restent donc au sein de l'Union européenne.

## 7. Durée de conservation

- **À la suppression de votre compte, la suppression est immédiate** : vos données personnelles (profil, email, chiens, historique de sorties, identifiants de connexion) sont effacées dès la confirmation, pas de délai de grâce.
- **Vos signalements sont conservés, mais anonymisés** : ils restent visibles sur la carte (valeur pour la communauté) sans plus aucun lien avec votre compte.
- Tant que votre compte est actif, vos données sont conservées pour la durée d'utilisation du service.

## 8. Vos droits

Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et de portabilité de vos données. Vous pouvez exercer directement dans l'application : modifier votre pseudo, supprimer votre compte (effacement immédiat, voir §7). Pour toute autre demande : **contact@safetypet.app**.

## 9. Sécurité

Les données sont stockées chez notre prestataire d'hébergement (Supabase) avec chiffrement en transit (HTTPS) et des règles d'accès strictes limitant chaque utilisateur à ses propres données (Row Level Security).

## 10. Âge minimum

L'inscription est réservée aux personnes de 16 ans ou plus.

## 11. Contact

Pour toute question relative à cette politique ou à vos données : **contact@safetypet.app**
