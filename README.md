#Todo list

TP Node JS avec ExpressJS, ioredis et mongoose
Le but du TP est de faire un site + API multi-utilisateurs en nodeJS et NoSQL pour gérer des Todos Lists.
Pug est utilisé pour le front.
MongoDB est utilisé pour la base de donnée.

Projet en ligne dans un repository privée sur : https://github.com/NicolasAuger/njs-todolist/

##Guide pour une bonne installation

Allez dans le dossier du projet

Installez les packages avec la commande suivante :
`npm i`

Dans un nouvel onglet de console, lancez MongoDB avec
`mongod`

Dans un nouvel onglet de console, lancez le serveur avec
`node app.js`


##Guide d'Utilisation

###Accès au site via le web

Accedez au serveur à l'adresse suivante :
**localhost:8080**

### Tache.Todo
Pour voir ce qui a été fait dans le projet et ce qui n'a pas pu être fait,
voir le fichier tache.todo qui est une checkliste de toutes les fonctionnalités du projet.


###Login
Par défaut, vous vous trouverez devant une page de connexion. (/index) - (localhost:8080 renvoie sur /index)
Sur cette page vous pouvez donc :
- Vous loguer si vous êtes déjà enregistré dans la base (/login)
- Vous inscrire si vous n'avez pas déjà un compte (/signup)
- Voir la liste complète des Utilisateurs (/users) (il est également possible de tout faire) --> GET, POST, DELETE, EDIT étaient demandés
- Voir la liste complète des Todos (/todos) (il est possible de tout faire, voir, modifier, supprimer, ajouter, compléter etc.. c'est comme une interface admin) --> GET, POST, DELETE, EDIT étaient demandés
- Voir la liste complète des Teams (/teams)

###Interface User
Une fois connecté (si vos identifiants ont été vérifiés dans la base), vous arrivez sur le dashboard (/:id/dashboard) (id de l'user ici)
De la, vous pouvez :
- Voir vos todos personnelles (celle dont vous êtes le destinataire) (/:id/todos) (accessible via le bouton 'voir la liste de mes tâches')
- Voir la liste de tous les utilisateurs (/users) (accessible via le bouton 'voir la liste des utilisateurs')
- Voir la liste des teams qui existent (/teams) (accessible via le bouton 'voir la liste des teams')

L'utilisateur ne peut voir que ses todos et non celles des autres utilisateurs.
L'utilisateur peut "voir" sa todo en détail (GET --> /:userId/todos/:todoId) (accessible via le lien en fond vert dans le tableau)
L'utilisateur ne peut pas modifier les tâches (sinon il pourrait modifier la tâche, son auteur etc..)
L'utilisateur peut supprimer sa tâche ou la compléter via les boutons situés respectivement à droite et à gauche


###Todos
Les tâches sont triées par rapport a leur statut (complétée ou non) puis par leur date de création
Une fois qu'une tâche est complétée, elle l'est définitivement. Elle est grisée et placée à la fin de la liste
Ainsi les nouvelles tâches se trouvent tout en haut et les plus anciennes complétées, tout en bas.
Si une tâche est complétée, il est toujours possible de la voir et de la supprimer via les cases vertes et rouges mais il n'est évidement pas possible de les modifier

Utilisation du module moment pour afficher : "Créée : il y a 3 minutes" etc..
Si la tâche n'est pas encore modifiée ou pas encore complétée, il y est écrit a la place : "Not Updated Yet !" ou "Not Completed Yet"
