const UserModel = require("../models/userModel");
const pool = require("../config/db");

// LOGIN
const login = async (req, res) => {

    const { email, mot_de_passe } = req.body;

    try {

        const user = await UserModel.findUserByEmail(email);

        if (!user) {
            return res.json({
                success: false,
                message: "Utilisateur introuvable"
            });
        }

        if (user.mot_de_passe !== mot_de_passe) {
            return res.json({
                success: false,
                message: "Mot de passe incorrect"
            });
        }

        res.json({
            success: true,
            message: "Connexion réussie",
            utilisateur: {
                id: user.id_user,
                nom: user.nom,
                email: user.email,
                points: user.points,
                niveau: user.niveau
            }
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};


//  REGISter
const register = async (req, res) => {

    const { nom, email, mot_de_passe } = req.body;

    try {

        // vérifier si email existe déjà
        const existingUser = await UserModel.findUserByEmail(email);

        if (existingUser) {
            return res.json({
                success: false,
                message: "Email déjà utilisé"
            });
        }

        // insérer utilisateur
        await pool.query(
            "INSERT INTO utilisateur (nom, email, mot_de_passe, points, niveau) VALUES ($1, $2, $3, $4, $5)",
            [nom, email, mot_de_passe, 0, "debutant"]
        );

        return res.json({
            success: true,
            message: "Compte créé avec succès"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};

module.exports = {
    login,
    register
};