// src/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("../config/jwt.config");

const authenticateToken = (req, res, next) => {
  // Le token est attendu dans l’en-tête Authorization : "Bearer TOKEN"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // on extrait le token

  if (!token) {
    return res.status(401).json({ message: 'Token non fourni' });
  }

  // Vérification du token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide ou expiré' });
    }

    req.user = user; // On ajoute l'utilisateur à la requête
    next(); // On passe au middleware suivant ou au contrôleur
  });
};

module.exports = authenticateToken;
