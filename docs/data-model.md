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