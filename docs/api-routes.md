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
