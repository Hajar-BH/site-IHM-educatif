## IHM Explorer :  Portail d'Apprentissage Interactif
https://hajar-bh.github.io/site-IHM-educatif/index.html
# Plan 
-	Partie 1:  Présentation du Projet
-	Partie 2: Installation et tests

## Partie 1:  Présentation du Projet

# Introduction
IHM Explorer est une plateforme web éducative dédiée à l'Interface Homme-Machine, conçue pour offrir une expérience d'apprentissage complète et interactive. Le site regroupe des cours théoriques, des ressources pratiques et un espace communautaire, permettant aux utilisateurs de tous niveaux de maîtriser les fondements de l’IHM.
En plus d’enseigner ces concepts, la plateforme les met en pratique à travers une interface soignée et intuitive, constituant ainsi un exemple concret des bonnes pratiques en IHM.
# Objectif du site
L'objectif principal d'IHM Explorer est de proposer une plateforme pédagogique accessible et engageante qui permet aux étudiants et professionnels de :
-	Acquérir des connaissances théoriques solides sur les principes d'IHM
-	Mettre en pratique ces connaissances à travers des exercices interactifs
-	Découvrir les outils et méthodologies de design d'interface
-	Rester informé des événements et tendances du domaine
# Aspects satisfaisants
-	Design responsive et moderne
L’interface s’adapte parfaitement à tous les types d’écrans. Les éléments visuels comme les dégradés de couleurs, les animations subtiles et les ombres portées créent une expérience immersive tout en maintenant une lisibilité optimale.
-	Interactivité riche
L'intégration d'éléments interactifs comme le Chatbot d'assistance, les filtres dynamiques pour la recherche de cours, et les animations réactives au défilement enrichissent considérablement l'expérience utilisateur. Ces fonctionnalités ne sont pas simplement décoratives mais facilitent réellement la navigation et l'engagement.
-	Structure de navigation intuitive
Le menu de navigation est organisé logiquement, avec des regroupements pertinents, permettant une prise en main immédiate, même pour les nouveaux visiteurs.
-	Mode clair/sombre fonctionnel
L'implémentation d'un basculement fluide entre modes clair et sombre démontre l'attention portée au confort visuel et aux préférences des utilisateurs. Cette fonctionnalité illustre également les principes d'accessibilité et d'adaptabilité enseignés dans les cours.
-	Accessibilité pour les débutants
Une attention particulière a été portée à l'accessibilité du site pour les utilisateurs novices. Les textes explicatifs, la signalétique visuelle claire et l'absence de jargon technique inutile facilitent la compréhension et l'utilisation du site dès la première visite.
# Résumé des améliorations par rapport au CC2
-	Améliorations de l'interface utilisateur
L'interface a été significativement améliorée pour offrir une expérience plus professionnelle et engageante, avec une attention particulière portée à la cohérence visuelle, aux transitions fluides et à l'accessibilité générale.
-	Prise en compte des remarques du CC2
Suite à vos retours constructifs reçus sur le prototype initial de CC2, j’ai ajouté plusieurs fonctionnalités essentielles :
-	Catégorie Événements pour les conférences et webinaires du domaine
-	Forum communautaire pour favoriser les échanges entre utilisateurs
-	Exercices pratiques accompagnés de leurs corrections détaillées
-	Système de groupes pour le travail collaboratif
-	Glossaire technique pour faciliter la compréhension des termes spécialisés
-	Quiz interactifs permettant aux utilisateurs d'évaluer leurs connaissances

Mise en place concrète du site
Le passage d'une maquette statique à un site fonctionnel représente une avancée majeure, ce qui permet aux utilisateurs d'interagir réellement avec les fonctionnalités plutôt que de simplement les visualiser.
-	Interface visuellement attrayante
L'aspect visuel a été particulièrement soigné avec l'intégration d'animations subtiles, une palette de couleurs harmonieuse et des éléments graphiques modernes qui rendent la navigation agréable tout en maintenant la lisibilité et l'accessibilité.
-	De nouvelles fonctionnalités ajoutées
Afin de rendre le prototype de CC2 plus intéressant : 
-	La section connexion bénéficie désormais d'une page dédiée, remplaçant la simple fenêtre modale du prototype
-	Les cours sont maintenant organisés selon une structure "pratiquer pour progresser" associant théorie, exercices et corrections
-	Le champ de contact a été élargi pour offrir plus d'options de communication
-	Les catégories ont été retravaillées pour une navigation plus intuitive
# Limites actuelles du projet
-	Fonctionnalités non implémentées
Par souci de cohérence et pour rester fidèle au scénario vertical défini, certains objets/fonctionnalités supplémentaires n'ont pas été intégrés.
-	Chatbot à capacités limitées
Le chatbot actuel fonctionne avec des réponses prédéfinies et ne possède pas de capacités d'intelligence artificielle avancées, limitant son utilité pour des questions complexes ou non anticipées.
-	Objets et fonctionnalités statiques
Dans le cadre du scénario horizontal, plusieurs éléments restent statiques plutôt que dynamiques, ce qui différencie le site des plateformes professionnelles tout en respectant les exigences spécifiques du CC3.
# Perspectives d’évolution
-	Enrichissement du scénario vertical
Approfondir et élargir le scénario vertical, et au lieu de se concentrer sur un objet ou deux nous pouvons travailler sur 3 objets, offrant une expérience plus complète et détaillée pour les parcours utilisateurs prioritaires.
-	Intégration de nouveaux objets et fonctionnalités
L'ajout de nouvelles fonctionnalités permettra d'élargir l’utilisateur cible et de répondre aux besoins d'un éventail plus large d'utilisateurs, permettant également la création de personae supplémentaires pour guider ces développements.

## Partie 2 : Installation et tests 

# IHM Explorer - Système d'Authentification
Cette installation concerne le système d'authentification pour le site web IHM Explorer. Il permet aux utilisateurs de se connecter, s'inscrire et accéder à des fonctionnalités personnalisées.

# Remarque 
# Pour une version statique (sans back-end) :
il suffit : 
1. Décompresser le dossier  (unzip)
1. Entrer dans le dossier MonSite.  
2. Ouvrez `index.html` dans un navigateur web.

Cette version permet la navigation entre les pages et donne accès à toutes les fonctionnalités de site, mais sans connexion réelle.

# Pour une version dynamique avec bach-end (Authentification)
# Prérequis
- Node.js 
  
## Fonctionnalités
- Authentification utilisateur (connexion/inscription)
- Barre de navigation dynamique qui change après connexion
- Menu utilisateur avec avatar et déconnexion
- Centre de notifications
- Gestion des sessions côté serveur

## Installation
1. Assurez-vous d'avoir Node.js installé (version 14+ recommandée)
2. Ouvrez un terminal dans le dossier du projet ' MonSite ' c’est-à-dire : 
3. Ouvrez le dossier IHM-CC3, puis entrez dans le dossier ' MonSite '   cd MonSite 
Dans le Terminal :  
3. Installez les dépendances :   npm install 
Le dossier node_modules sera généré automatiquement après cette commande 

## Démarrage du serveur
1. Exécutez la commande :   npm start
2. Le serveur démarre par défaut sur le port 3000
3. Accédez au site via l'URL : http://localhost:3000

## Test des fonctionnalités principales
## Connexion test
Pour tester le système :
Accédez à la page de connexion via le bouton "Connexion" dans l'en-tête
- Testez la connexion avec les identifiants suivants :
- **Email**: boumezganehajar@gmail.com 
- **Mot de passe**: 12345ihm
Testez également la création de compte avec l'onglet "Inscription"

## Structure des fichiers
- `server.js` : Serveur Express avec configuration de l'authentification
- `auth.js` : Script gérant l'interface utilisateur et les interactions avec l'API d'auth




