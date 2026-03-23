const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// --- CONFIGURATION DES MIDDLEWARES ---
app.use(cors()); // Autorise les requêtes provenant d'autres origines
app.use(bodyParser.json()); // Permet à Express de lire le format JSON dans le corps des requêtes

// --- CONFIGURATION DE LA BASE DE DONNÉES (SGBD) ---
// Crée un fichier 'blog.db' s'il n'existe pas
const db = new sqlite3.Database('./blog.db', (err) => {
    if (err) console.error("Erreur de connexion à la base de données :", err.message);
    else console.log("Connecté à la base de données SQLite (blog.db)");
});

// Création de la table 'articles' si elle n'existe pas encore
db.run(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    contenu TEXT NOT NULL,
    auteur TEXT NOT NULL,
    date TEXT,
    categorie TEXT,
    tags TEXT
)`, (err) => {
    if (err) console.error("Erreur lors de la création de la table :", err.message);
});

// --- DÉFINITION DES ROUTES DE L'API ---

/**
 * 1. LIRE TOUS LES ARTICLES
 * Supporte le filtrage optionnel par catégorie : /api/articles?categorie=Tech
 */
app.get('/api/articles', (req, res) => {
    const { categorie } = req.query;
    let sql = "SELECT * FROM articles";
    let params = [];

    if (categorie) {
        sql += " WHERE categorie = ?";
        params.push(categorie);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: "Erreur serveur", detail: err.message });
        res.status(200).json(rows); // Code 200: OK
    });
});

/**
 * 2. RECHERCHER UN ARTICLE
 * Cherche un mot-clé dans le titre ou le contenu : /api/articles/search?query=texte
 */
app.get('/api/articles/search', (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Le paramètre de recherche 'query' est requis." });

    const sql = "SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?";
    const searchTerm = `%${query}%`; // % permet de chercher n'importe où dans le texte

    db.all(sql, [searchTerm, searchTerm], (err, rows) => {
        if (err) return res.status(500).json({ error: "Erreur serveur", detail: err.message });
        res.status(200).json(rows);
    });
});

/**
 * 3. LIRE UN ARTICLE UNIQUE VIA SON ID
 * Exemple : /api/articles/1
 */
app.get('/api/articles/:id', (req, res) => {
    const sql = "SELECT * FROM articles WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        if (!row) return res.status(404).json({ message: "Article non trouvé" }); // Code 404: Not Found
        res.status(200).json(row);
    });
});

/**
 * 4. CRÉER UN NOUVEL ARTICLE
 * Enregistre les données envoyées en JSON dans la base de données
 */
app.post('/api/articles', (req, res) => {
    const { titre, contenu, auteur, date, categorie, tags } = req.body;

    // Validation des entrées obligatoires (Bonnes pratiques)
    if (!titre || !auteur || !contenu) {
        return res.status(400).json({ message: "Champs obligatoires manquants : titre, auteur, contenu" });
    }

    const sql = `INSERT INTO articles (titre, contenu, auteur, date, categorie, tags) VALUES (?, ?, ?, ?, ?, ?)`;
    const finalDate = date || new Date().toISOString().split('T')[0]; // Date du jour par défaut
    
    db.run(sql, [titre, contenu, auteur, finalDate, categorie, tags], function(err) {
        if (err) return res.status(500).json({ error: "Erreur lors de la création" });
        // Code 201: Création réussie
        res.status(201).json({ 
            message: "Article créé avec succès", 
            id: this.lastID 
        });
    });
});

/**
 * 5. MODIFIER UN ARTICLE EXISTANTs
 */
app.put('/api/articles/:id', (req, res) => {
    const { titre, contenu, auteur, categorie, tags } = req.body;
    
    // On met à jour seulement les champs fournis dans la requête
    const sql = `UPDATE articles SET titre = ?, contenu = ?, auteur = ?, categorie = ?, tags = ? WHERE id = ?`;
    
    db.run(sql, [titre, contenu, auteur, categorie, tags, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: "Erreur lors de la mise à jour" });
        if (this.changes === 0) return res.status(404).json({ message: "Article non trouvé" });
        res.status(200).json({ message: "Article mis à jour avec succès" });
    });
});

/**
 * 6. SUPPRIMER UN ARTICLE
 */
app.delete('/api/articles/:id', (req, res) => {
    db.run("DELETE FROM articles WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: "Erreur lors de la suppression" });
        if (this.changes === 0) return res.status(404).json({ message: "Article non trouvé" });
        res.status(200).json({ message: "Article supprimé définitivement de la base de données" });
    });
});

// --- LANCEMENT DU SERVEUR ---
app.listen(PORT, () => {
    console.log("===============================================");
    console.log(`  SERVEUR BACKEND DÉMARRÉ SUR LE PORT : ${PORT}`);
    console.log(`  URL de base : http://localhost:${PORT}/api`);
    console.log("===============================================");
});
