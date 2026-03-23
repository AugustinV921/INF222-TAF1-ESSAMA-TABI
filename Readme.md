#  TAF 1 - INF222 : SYSTÈME DE GESTION DE BLOG (BACKEND & API REST)

##  Présentation du Projet
Ce projet s'inscrit dans le cadre de l'unité d'enseignement **INF222 - Développement Backend (EC1)**. Il consiste en la conception et la réalisation d'une application de blog complète, articulée autour d'une architecture client-serveur. 

L'objectif principal est de démontrer la maîtrise des concepts fondamentaux du web : la gestion des protocoles HTTP, la manipulation d'un **SGBD (Système de Gestion de Base de Données)** et la création d'une interface utilisateur (Frontend) dynamique consommant une API REST.

---

##  Stack Technologique
Le projet repose sur une pile technologique moderne et robuste :

| Composant | Technologie | Rôle |
| :--- | :--- | :--- |
| **Runtime** | **Node.js** | Environnement d'exécution JavaScript côté serveur. |
| **Framework** | **Express.js** | Gestion du routage, des middlewares et des requêtes HTTP. |
| **SGBD** | **SQLite3** | Base de données relationnelle légère pour la persistance des données. |
| **Middleware** | **CORS & Body-Parser** | Sécurité des échanges et traitement des données JSON. |
| **Frontend** | **HTML5 / Tailwind CSS** | Interface utilisateur responsive et stylisée. |
| **API Client** | **JavaScript (Fetch API)** | Communication asynchrone entre le Frontend et le Backend. |

---

##  Fonctionnalités Implémentées

### 1. Gestion des Articles (CRUD)
- **Create** : Ajout de nouveaux articles avec validation des champs (Titre, Auteur, Contenu).
- **Read** : Visualisation de la liste globale ou filtrage par catégorie.
- **Update** : Modification partielle ou totale des articles existants via l'ID.
- **Delete** : Suppression définitive d'un enregistrement en base de données.

### 2. Moteur de Recherche
- Recherche plein texte (Full-text search) permettant de trouver des articles par mots-clés présents dans le titre ou le corps du texte.

### 3. Persistance des Données
- Contrairement à un stockage volatil en mémoire vive (RAM), l'utilisation de **SQLite** garantit que les articles sont conservés dans le fichier `blog.db` même après l'arrêt du serveur.

---

## 📡 Documentation de l'API (Points de terminaison)

L'API suit les standards **RESTful**. Voici le détail des endpoints disponibles :

| Méthode | URL | Description | Code HTTP (Succès) |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/articles` | Récupère la liste de tous les articles. | `200 OK` |
| **GET** | `/api/articles/:id` | Récupère un article spécifique par son identifiant. | `200 OK` |
| **GET** | `/api/articles/search?query=...` | Recherche des articles par mot-clé. | `200 OK` |
| **POST** | `/api/articles` | Crée un nouvel article (Objet JSON requis). | `201 Created` |
| **PUT** | `/api/articles/:id` | Modifie un article existant via son ID. | `200 OK` |
| **DELETE** | `/api/articles/:id` | Supprime un article spécifique. | `200 OK` |

### Exemple de corps de requête (JSON) pour un POST :
```json
{
  "titre": "Introduction au Backend",
  "contenu": "Le développement backend est essentiel pour la gestion des données...",
  "auteur": "Jean Eboa",
  "categorie": "Informatique",
  "tags": "nodejs, express, tp"
}