// src/controllers/utilisateur.controller.js

const utilisateurService = require('../services/utilisateur.service');

// ✅ Créer un nouvel utilisateur
const create = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.createUtilisateur(req.body);
    res.status(201).json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Récupérer tous les utilisateurs avec recherche, pagination et tri
const getAll = async (req, res) => {
  try {
    // Récupère les paramètres de query dans l'URL (facultatifs)
    const { search, limit, offset, orderBy, orderDir } = req.query;

    const utilisateurs = await utilisateurService.getAllUtilisateurs({
      search,
      limit,
      offset,
      orderBy,
      orderDir
    });

    res.status(200).json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Récupérer un utilisateur par son ID
const getOne = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.getUtilisateurById(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Mettre à jour un utilisateur
const update = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.updateUtilisateur(req.params.id, req.body);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Supprimer un utilisateur
const deleteUtilisateur = async (req, res) => {
  try {
    const result = await utilisateurService.deleteUtilisateur(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔄 Export des contrôleurs
module.exports = {
  create,
  getAll,
  getOne,
  update,
  delete: deleteUtilisateur
};
