# Around Activities

> **Le réseau social des expériences partagées — pensé pour ceux qui veulent rencontrer de vraies personnes, pas juste scroller.**

---

## Le problème

Chaque année en France, des centaines de milliers de personnes — nouveaux arrivants, étudiants étrangers, jeunes qui déménagent — se retrouvent dans une nouvelle ville sans réseau social. Elles ont envie de sortir, de faire des activités, de rencontrer du monde. Mais elles ne savent ni quoi faire, ni avec qui le faire.

Les solutions existantes ne répondent pas vraiment à ce besoin :
- **Google** donne des idées d'activités mais pas de compagnons pour les faire
- **Meetup** est trop formel et peu adapté aux jeunes
- **Facebook Groups** est trop généraliste et peu rassurant pour un nouvel arrivant

**Around Activities** comble ce vide : une plateforme pensée pour créer du lien social naturellement, autour d'activités et de centres d'intérêt communs.

---

## La solution

Around Activities permet aux utilisateurs de :
- **Découvrir** des catégories d'activités (Sport, Art, Cuisine, Musique, etc.)
- **Rejoindre** des groupes existants créés par d'autres membres
- **Créer** leurs propres groupes et organiser des sorties
- **Rencontrer** des personnes qui partagent leurs centres d'intérêt
- **Communiquer** en temps réel via le chat de groupe ou en privé avec leurs amis

---

## Fonctionnalités

### Authentification
- Inscription avec prénom, nom, email, mot de passe, ville, pays d'origine, date de naissance
- Connexion sécurisée avec JWT
- Mot de passe oublié avec réinitialisation par email (Brevo/Nodemailer)

### Onboarding
- Parcours en 3 étapes après inscription : ville → langue(s) parlée(s) → centres d'intérêt
- Sauvegarde en base de données

### Exploration
- 8 catégories d'activités : Sport & Fitness, Art & Culture, Restaurant & Cuisine, Musique & Événements, Bien-être & Détente, Tech & Jeux vidéo, Nature & Plein air, Rencontres & Chill
- Affichage du nombre de groupes disponibles par catégorie
- Liste des groupes avec date, lieu, nombre de membres

### Groupes
- Créer un groupe dans une catégorie
- Rejoindre / Quitter un groupe
- Supprimer son groupe (créateur uniquement)
- Voir les membres d'un groupe avec lien vers leur profil

### Profil utilisateur
- Affichage : ville, pays d'origine, âge, langue(s) parlée(s), centres d'intérêt, groupes
- Modification du profil (tous les champs)
- Profil public consultable par les autres membres

### Système d'amis
- Envoyer / Accepter / Refuser une demande d'ami
- Notification en temps réel à la réception d'une demande
- Liste des amis dans la page Conversations

### Messagerie temps réel (Socket.IO)
- Chat de groupe : tous les membres d'un groupe peuvent communiquer
- Chat privé : entre deux amis
- Historique des messages persisté en base de données
- Auto-scroll et déduplication des messages

---

## Stack technique

### Frontend
- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** + variables CSS custom
- **Socket.IO Client** pour la messagerie temps réel
- Polices : Playfair Display (titres) + DM Sans (body)

### Backend
- **Node.js** + **Express.js**
- **Prisma ORM** (v7)
- **PostgreSQL**
- **Socket.IO** pour la messagerie temps réel
- **JWT** pour l'authentification
- **bcrypt** pour le hashage des mots de passe
- **Nodemailer** + **Brevo** pour les emails

### Déploiement
- **Coolify** + **Docker**

---

## Modèle de données

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs (infos profil, auth) |
| `activities` | Catégories d'activités (8 catégories fixes) |
| `groups` | Groupes créés par les utilisateurs |
| `memberships` | Relation utilisateur ↔ groupe |
| `users_interests` | Centres d'intérêt des utilisateurs |
| `friendships` | Demandes et relations d'amitié |
| `messages` | Messages de groupe et messages privés |

---

## Routes API

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/forgot-password` | Mot de passe oublié |
| POST | `/api/auth/reset-password` | Réinitialisation |

### Utilisateurs
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/users/:id` | Voir un profil |
| PUT | `/api/users/me` | Modifier mon profil |
| GET | `/api/users/me/groups` | Mes groupes |

### Activités
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/activities` | Liste des catégories |
| GET | `/api/activities/:id` | Détail avec ses groupes |

### Groupes
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/groups` | Créer un groupe |
| GET | `/api/groups/:id` | Détail d'un groupe |
| POST | `/api/groups/:id/join` | Rejoindre |
| DELETE | `/api/groups/:id/leave` | Quitter |
| DELETE | `/api/groups/:id` | Supprimer |

### Amis
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/friends/request/:userId` | Envoyer une demande |
| PUT | `/api/friends/accept/:requestId` | Accepter |
| PUT | `/api/friends/refuse/:requestId` | Refuser |
| GET | `/api/friends` | Liste d'amis |
| GET | `/api/friends/requests` | Demandes reçues |
| GET | `/api/friends/status/:userId` | Statut avec un user |

### Messages
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/messages/group/:groupId` | Messages d'un groupe |
| GET | `/api/messages/private/:userId` | Messages privés |
| POST | `/api/messages` | Envoyer un message |

---

## Installation

### Prérequis
- Node.js v18+
- PostgreSQL
- npm

### Backend

```bash
git clone https://github.com/kourasoumare/Around-activities.git
cd Around-activities
npm install
```

Crée un fichier `.env` à la racine :

```env
PORT=5000
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/around_activities"
JWT_SECRET=around_activities_secret_key
BREVO_USER=votre_email_brevo
BREVO_PASS=votre_cle_brevo
FRONTEND_URL=http://localhost:3000
```

Lance les migrations et démarre :

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

### Frontend

```bash
git clone https://github.com/kourasoumare/frontend-Around-Activities-V2.git
cd frontend-Around-Activities-V2
npm install
npm run dev
```

L'application est accessible sur `http://localhost:3000`

---

## Équipe

| Membre | Rôle |
|--------|------|
| **Koura** | Chef de projet · Fullstack (back : profil, amis, messagerie Socket.IO · front : landing, onboarding, conversations, profil) |
| **Imad** | Frontend |
| **Bambi** | Backend (authentification, inscription, connexion, mot de passe oublié) |
| **Faisal** | Backend (création, rejoindre, quitter, supprimer un groupe) |

---

## Vision

Around Activities n'est pas seulement une application d'activités. C'est avant tout une plateforme centrée sur la découverte locale, la socialisation et l'intégration des nouveaux arrivants.

**Prochaines fonctionnalités prévues :**
- Stories de sorties (photos et récits après une sortie)
- Carte interactive pour découvrir les activités autour de soi
- Recommandations personnalisées basées sur les centres d'intérêt
- Événements locaux et nationaux
- Système de favoris et de commentaires
- Système de signalement
- Notifications push
- Application mobile

---

## Conventions Git

**Branches :**
- `main` → version stable en production
- `develop` → branche de développement principale
- `feat/nom` → nouvelle fonctionnalité
- `fix/nom` → correction de bug

**Commits :**
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `chore:` configuration
- `refactor:` amélioration sans changement de comportement

---

*Projet réalisé dans le cadre du projet intégrateur — HETIC Fast Track 2026*