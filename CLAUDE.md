# CLAUDE.md

# Règles de développement

Ces consignes sont obligatoires.

## Git

- Ne jamais développer sur la branche `main`.
- Ne jamais modifier, committer, pousser ou fusionner (`merge`) la branche `main`.
- Toute nouvelle fonctionnalité, correction ou refactoring doit être réalisé sur une **nouvelle branche dédiée**.
- Une **Pull Request (PR)** est obligatoire avant toute fusion.
- Ne jamais créer une PR de sa propre initiative : uniquement sur demande explicite du développeur.
- Ne jamais effectuer un `merge` sans validation explicite du développeur.
- Réaliser des **commits réguliers** avec des messages clairs (idéalement un commit par modification ou fonctionnalité terminée).

## Développement

Avant toute modification importante :
- Analyser l'impact sur l'architecture.
- Réutiliser l'existant avant de créer du nouveau code.
- Demander confirmation en cas de doute.

## Qualité

- Produire un code simple, lisible et maintenable.
- Tester les modifications avant de les considérer terminées.
- Mettre à jour la documentation si le comportement de l'application évolue.

## Communication

À la fin de chaque tâche, fournir un résumé comprenant :
- les fichiers modifiés ;
- les commits réalisés ;
- les éventuels points d'attention ;
- les prochaines étapes recommandées.

## Principe général

En cas de doute, **demander au développeur** plutôt que de prendre une décision pouvant impacter le dépôt Git ou l'architecture du projet.
