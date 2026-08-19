# SafetyPet — Préparation de la section "Sécurité des données" (Data Safety)

Formulaire à remplir dans Play Console (Policy > App content > Data safety). Structuré ici exactement comme le formulaire Google le demande, pour transcription directe. Fondé sur le schéma de données réel de l'app.

**Rappel de terminologie Google :** *"Collectée"* = transmise à votre propre back-end (Supabase compte comme votre prestataire technique, pas comme un tiers séparé) et vous en gardez le contrôle. *"Partagée"* = transférée à une entreprise externe qui l'utilise pour ses propres finalités (ex. un réseau publicitaire). **SafetyPet ne partage aucune donnée au sens de cette seconde définition.**

---

## Question globale

- **L'app collecte-t-elle ou partage-t-elle des données utilisateur ?** → **Oui, elle en collecte** (pas de partage à des tiers)
- **Toutes les données sont-elles chiffrées en transit ?** → **Oui** (HTTPS de bout en bout via Supabase)
- **Proposez-vous un moyen de demander la suppression des données ?** → **Oui**, en libre-service depuis l'app (Profil > Supprimer mon compte)

---

## Détail par type de donnée

### Position (Location)
| Champ | Valeur |
|---|---|
| Type | Position précise |
| Collectée | Oui |
| Partagée | Non |
| Optionnelle ou obligatoire | Optionnelle (l'app fonctionne en mode dégradé sans, position saisie manuellement) |
| Finalité(s) | Fonctionnalité de l'app (carte, création de signalement), Personnalisation |
| Traitée de façon éphémère uniquement ? | Non pour un signalement (la position publiée est conservée) ; **oui** pour le suivi de sortie (positions individuelles jamais transmises au serveur, seule la distance calculée est conservée — voir politique de confidentialité §4) |

### Informations personnelles (Personal info)
| Champ | Valeur |
|---|---|
| Sous-type | Adresse e-mail |
| Collectée | Oui |
| Partagée | Non |
| Optionnelle ou obligatoire | Obligatoire (création de compte) |
| Finalité(s) | Authentification du compte |

*(Pas de nom légal, pas d'adresse postale, pas de numéro de téléphone collectés.)*

### Photos et vidéos
| Champ | Valeur |
|---|---|
| Collectée | Oui |
| Partagée | Non |
| Optionnelle ou obligatoire | Optionnelle (photo de profil, photo sur un signalement) |
| Finalité(s) | Fonctionnalité de l'app |

### Activité dans l'app (App activity)
| Champ | Valeur |
|---|---|
| Sous-type | Contenu généré par l'utilisateur (signalements, profils de chiens, historique de sorties) |
| Collectée | Oui |
| Partagée | Non |
| Optionnelle ou obligatoire | Selon la fonctionnalité (voir CGU) |
| Finalité(s) | Fonctionnalité de l'app |

### Identifiants (Device or other IDs)
| Champ | Valeur |
|---|---|
| Collectée | Non |

*(Pas d'identifiant publicitaire, pas de tracking cross-app — aucun SDK d'analyse ou de publicité tiers n'est intégré à l'app.)*

### Catégories à déclarer explicitement comme non collectées
Financial info · Health and fitness *(les données de sortie sont une distance/durée, pas des données de santé au sens du formulaire)* · Messages · Web browsing · Search history · Contacts · Calendar

---

## Points à vérifier avant de soumettre

- [x] Région d'hébergement Supabase confirmée : Union européenne (West EU — Irlande, eu-west-1)
- [ ] Confirmer que la fonction `delete-account` est bien déployée avant de cocher "l'utilisateur peut demander la suppression de ses données" — sinon la déclaration serait inexacte
