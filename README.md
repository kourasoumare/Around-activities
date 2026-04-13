# Around Activities

## 1) Problème

- Segment cible : nouveaux arrivants en France, 
  étudiants étrangers, jeunes qui viennent de déménager

- Problème : quand on arrive dans une nouvelle ville, 
  on ne sait ni quoi faire, ni avec qui le faire. 
  On peut vite se sentir seul et s'ennuyer.

- Exemple concret : un étudiant étranger arrive à Paris 
  en septembre. Il ne connaît personne. Il veut sortir 
  mais ne sait pas quoi faire ni comment rencontrer 
  des gens partageant ses intérêts.

- Solutions actuelles + limites :
  - Google → donne des idées d'activités mais pas de 
    compagnons pour les faire
  - Meetup → trop formel, pas adapté aux jeunes
  - Facebook Groups → trop généraliste, peu rassurant 
    pour un nouvel arrivant

## 2) Proposition de valeur

- En une phrase : Around Activities permet aux nouveaux 
  arrivants en France de trouver des sorties qui matchent 
  avec leur génération et leurs centres d'intérêts, 
  et de les faire en groupe pour rencontrer des personnes 
  facilement et naturellement.

- Différenciation (vs alternatives) :
  - Contrairement à Google → on ne trouve pas juste 
    une activité, on trouve des gens avec qui la faire
  - Contrairement à Meetup → le parcours est simple, 
    guidé et pensé pour les jeunes
  - Contrairement à Facebook Groups → l'app est 
    entièrement dédiée aux sorties en groupe, 
    pas noyée dans un réseau social généraliste
  - Notre vrai plus : l'utilisateur n'a pas besoin 
    de savoir quoi chercher, les catégories lui donnent 
    des idées selon ses centres d'intérêts 
    et le groupe fait le reste

## 3) MVP (périmètre 2 mois)

### Inclus
- Inscription / Connexion
- Profil utilisateur simple (nom, ville, date de création)
- Parcourir les sorties par catégorie
- Voir le détail d'une sortie (titre, description, 
  lieu, date, nombre de participants, organisateur)
- Rejoindre une sortie existante
- Créer sa propre sortie (catégorie, titre, 
  description, lieu, date, nombre max de participants)
- Voir la liste des membres d'une sortie

### Exclu (fonctionnalités futures)
- Messagerie entre membres
- Notifications
- Carte interactive
- Recommandations personnalisées par algorithme
- Système de commentaires
- Système de signalement
- Favoris
- Sortie en solo
- Système d'avatar personnalisé
- Centres d'intérêts sur le profil
- Modifier une sortie après création
- Proposer des lieux spécifiques (cinémas, restaurants...) 
  avec redirection vers réservation selon le type de lieu
  (intégration Google Places API)
- Signaler à l'utilisateur quand deux de ses sorties 
  tombent le même jour

## 4) Architecture (vue d'ensemble)

Frontend (React) → Backend (Node.js / Express) → 
Base de données (MySQL)

- Frontend : interface utilisateur, navigation entre 
  les pages, appels API
  
- Backend : logique métier, validation des données, 
  gestion de l'authentification, accès à la base 
  de données
  
- Base de données : stockage des utilisateurs, 
  des sorties et des membres

Outils et technologies :
- Frontend : React, React Router, Tailwind CSS, Axios
- Backend : Node.js, Express, à compléter
- Base de données : MySQL, à compléter
- Déploiement : à compléter

## 5) Modèle de données (v0)

- User : id, nom, email, mot de passe, ville, 
  date de création

- Activity : id, titre, description, catégorie, 
  lieu, date, nombre maximum de participants, 
  date de création, id de l'organisateur (→ User)

- Participation : id, id de l'utilisateur (→ User), 
  id de la sortie (→ Activity), date d'inscription

Relations :
- 1 User peut créer plusieurs Activity (1:N)
- 1 User peut rejoindre plusieurs Activity (N:N)
- 1 Activity peut avoir plusieurs participants (N:N)
- La table Participation gère la relation N:N 
  entre User et Activity

## 6) Routes API (v0)

Auth :
- POST /api/auth/register → créer un compte
- POST /api/auth/login    → se connecter

Utilisateurs :
- GET /api/users/:id      → voir le profil d'un utilisateur
- PUT /api/users/:id      → modifier mon profil

Sorties :
- GET /api/activities        → voir toutes les sorties
- POST /api/activities       → créer une sortie
- GET /api/activities/:id    → voir le détail d'une sortie
- DELETE /api/activities/:id → supprimer une sortie

Participations :
- POST /api/activities/:id/join    → rejoindre une sortie
- DELETE /api/activities/:id/leave → se retirer d'une sortie

## 7) Logique métier (v0)

Règles sur les sorties :
- Une sortie ne peut être supprimée que par 
  son organisateur
- Une sortie doit avoir obligatoirement : un titre, 
  une catégorie, un lieu, une date et un nombre 
  maximum de participants
- Une sortie ne peut pas avoir une date dans le passé
- Une sortie doit avoir au minimum 2 participants 
  maximum (sinon c'est une sortie solo)

Règles sur les participations :
- Un utilisateur peut rejoindre une sortie uniquement 
  si le nombre maximum de participants n'est pas atteint
- Un utilisateur ne peut pas rejoindre sa propre sortie 
  car il en est déjà l'organisateur
- Un utilisateur peut rejoindre plusieurs sorties 
  en même temps
- Un utilisateur peut se retirer d'une sortie 
  quand il veut
- Un organisateur ne peut pas se retirer de 
  sa propre sortie

Règles sur les comptes :
- Un email ne peut pas être utilisé deux fois
- Un utilisateur doit être connecté pour créer 
  ou rejoindre une sortie

Fonctionnalité future :
- Signaler à l'utilisateur quand deux de ses sorties 
  tombent le même jour et lui proposer d'en annuler 
  une ou de garder les deux

## 8) Installation (à compléter quand le code existe)

### Frontend
- à compléter

### Backend
- à compléter

## 9) Roadmap 2 mois

### Semaine 1-2 : Mise en place
- Initialisation du repo GitHub
- Structure des dossiers
- Documentation complète (README, modèles, routes)
- Maquettes des pages sur Figma
- Setup frontend React + backend Node.js
- Connexion base de données MySQL

### Semaine 3-4 : Authentification
- Inscription et connexion utilisateur
- Profil utilisateur
- Protection des routes privées

### Semaine 5-6 : Fonctionnalités principales
- Affichage des sorties par catégorie
- Détail d'une sortie
- Créer une sortie
- Rejoindre / se retirer d'une sortie
- Affichage des membres d'une sortie

### Semaine 7 : Intégration et tests
- Connexion frontend + backend
- Tests de toutes les fonctionnalités
- Correction des bugs

### Semaine 8 : Finalisation
- Design final et responsive mobile
- Déploiement
- Préparation de la présentation

## 10) Conventions d'équipe

### Répartition des rôles
- Membre 1 (chef de projet) : Backend + Base de données 
  + pilotage de l'équipe
- Membre 2 : Backend + Base de données
- Membre 3 : Frontend
- Membre 4 : Frontend

### Convention de branches
- main        → version stable et fonctionnelle
- dev         → branche de développement principale
- feat/nom    → nouvelle fonctionnalité 
  (ex: feat/login, feat/create-activity)
- fix/nom     → correction de bug
  (ex: fix/join-activity)

### Convention de commits
- feat:     nouvelle fonctionnalité
- fix:      correction de bug
- docs:     documentation
- chore:    configuration, structure
- refactor: amélioration du code sans changer 
            le comportement

Exemples :
- feat: add login page
- fix: correct join activity bug
- docs: update README

### Règles de merge
- On ne merge jamais directement sur main
- On passe toujours par dev d'abord
- On relit le code d'un autre avant de merger

### Points d'équipe
- 2 fois par semaine (30 minutes)
- Chacun dit ce qu'il a fait et ce qu'il va faire
- On signale les blocages pour s'entraider
