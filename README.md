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

### Infos avant de commencer
Je tiens à préciser que nous n'avons pas implémenter la session jusqu'au bout, il n'y a pas de gestion de token ni de mise en base redis.
Cela dit, au travers du formulaire de login, une session est créée et les informations de l'utilisateur et de sa team y sont inscrites. C'est grâce à ces informations stockées dans la session que la partie dashboard de l'utilisateur a pu être implémentée.
Sur la page d'accueil (**localhost:8080/index**), il y a des boutons en bas qui permettent d'accéder à des vues et options qui sont reservées à l'admin du site (il n'y a pas de compte admin donc il est possible d'y accéder tout le temps mais elles auraient dû être accessible par l'admin uniquement).

Commencez votre visite par créer un nouveau compte pour avoir accès au reste. Pour tout découvrir, créez-en plusieurs pour assigner des teams / tâches.


###Login
Par défaut, vous vous trouverez devant une page de connexion. (**localhost:8080/index**) - (localhost:8080 renvoie sur /index)
Sur cette page vous pouvez donc :
- Vous loguer si vous êtes déjà enregistré dans la base (**localhost:8080/login**)
- Vous inscrire si vous n'avez pas déjà un compte (**localhost:8080/signup**)
- Voir la liste complète des Utilisateurs (**localhost:8080/users**) (il est également possible de tout faire) --> GET, POST, DELETE, EDIT étaient demandés
- Voir la liste complète des Todos (**localhost:8080/todos**) (il est possible de tout faire, voir, modifier, supprimer, ajouter, compléter etc.. c'est comme une interface admin) --> GET, POST, DELETE, EDIT étaient demandés
- Voir la liste complète des Teams (**localhost:8080/teams**)

###Interface User
Une fois connecté (si vos identifiants ont été vérifiés dans la base), vous arrivez sur le dashboard (/:id/dashboard) (id de l'user ici)
De la, vous pouvez :
- Voir vos todos personnelles (celles dont vous êtes le destinataire) (/:id/todos) (accessible via le bouton 'voir la liste de mes tâches')
- Voir la liste de tous les utilisateurs (**localhost:8080/users**) (accessible via le bouton 'voir la liste des utilisateurs')
- Voir la liste des teams qui existent (**localhost:8080/teams**) (accessible via le bouton 'voir la liste des teams')
- Rejoindre une team (si vous n'en avez pas déjà une)
- Voir vos infos personnelles
- Modifier vos infos personnelles
- Quitter votre team (si vous en avez une)

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

###teams
Il est possible de créer une team (vue admin) accessible via **localhost:8080/index**
Un utilisateur peut rejoindre une team lors de la création de son compte
Un utilistauer peut rejoindre une team n'importe quand depuis son dashboard (s'il n'en a pas déjà une)
Un utilisateur peut quitter sa team n'importe quand (s'il en a une)
Un utilisateur peut voir les informations de n'importe quelle team (son nom, son slogan, son nombre de membres et la liste de tous les membres)
Un utilisateur ne peut ni modifier, ni supprimer aucune team.
Un admin peut modifier et supprimer n'importe quelle team (accessible via **localhost:8080/teams**)
