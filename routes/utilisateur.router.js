// src/routes/utilisateur.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/utilisateur.controller');

// GET /utilisateurs
router.post('/', controller.create);       // Créer un nouvel utilisateur
router.get('/', controller.getAll);        // Récupérer tous les utilisateurs
router.get('/:id', controller.getOne);     // Récupérer un utilisateur par son ID
router.put('/:id',controller.update);       // Mettre à jour un utilisateur par son ID
router.delete('/:id', controller.delete);   // Supprimer un utilisateur par son ID


module.exports = router;
