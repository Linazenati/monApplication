// src/services/utilisateur.service.js

const { Utilisateur, Client, Agent,Utilisateur_inscrit ,Administrateur } = require('../models');
const { Op } = require("sequelize"); // Importe les opérateurs Sequelize (comme Op.like pour les filtres avancés)
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("../config/jwt.config"); 



// ✅ Créer un nouvel utilisateur
const createUtilisateur = async (data) => {
  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const utilisateur = await Utilisateur.create({
    ...data,
    password: hashedPassword
  });
     
  console.log("Création de l'utilisateur avec données :", data);
  console.log("Mot de passe hashé :", hashedPassword);

  if (data.role === 'Utilisateur_inscrit') {
    await Utilisateur_inscrit.create({ id: utilisateur.id });
  } else if (data.role === 'agent') {
    await Agent.create({ id: utilisateur.id });
  } else if (data.role === 'admin') {
    await Administrateur.create({ id: utilisateur.id });
  }
  else if (data.role === 'client') {
    await Client.create({ id: utilisateur.id });
     
    return utilisateur;
  };

}
// ✅ Récupérer tous les utilisateurs avec recherche, pagination et tri
const getAllUtilisateurs = async ({
  search = "",       // Recherche globale (nom/email/role)
  role = "",         // Filtre spécifique sur le rôle
  limit = 5,
  offset = 0,
  orderBy = "id",
  orderDir = "ASC"
} = {}) => {
  const whereClause = {};

  // 🔍 Recherche globale
  if (search) {
    whereClause[Op.or] = [
      { nom: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { role: { [Op.like]: `%${search}%` } },
    ];
  }

  // 🎯 Filtrage spécifique par rôle
  if (role) {
    whereClause.role = role;  // Filtrer uniquement par rôle exact
  }

  // 🔄 Requête Sequelize
  try {
    const users = await Utilisateur.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit) || 10,
      offset: parseInt(offset) || 0,
      order: [[orderBy || 'id', orderDir || 'ASC']],
    });

    return { rows: users.rows, count: users.count };
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs", error);
    throw new Error('Erreur de récupération des utilisateurs');
  }
};


// ✅ Récupérer un utilisateur par son ID
const getUtilisateurById = async (id) => {
  return await Utilisateur.findByPk(id);
};

const getUtilisateurByEmail = async (email) => {
  return await Utilisateur.findOne({ where: { email } });
};

const getUtilisateurByMatricule = async (matricule) => {
  return await Utilisateur.findOne({ where: { matricule } });
};

// ✅ Mettre à jour un utilisateur existant
const updateUtilisateur = async (id, data) => {
  const utilisateur = await Utilisateur.findByPk(id);
  if (!utilisateur) {
    throw new Error('Utilisateur non trouvé');
  }
  return await utilisateur.update(data);
};


// ✅ Supprimer un utilisateur
const deleteUtilisateur = async (id) => {
  const utilisateur = await Utilisateur.findByPk(id);
  if (!utilisateur) {
    throw new Error('Utilisateur non trouvé');
  }
  return await utilisateur.destroy();
};



// ✅ Login utilisateur
const login = async (credentials) => {
  const {email, password} = credentials;

  const utilisateur = await Utilisateur.findOne({ where: { email } });
  if (!utilisateur) {
    throw new Error("Utilisateur non trouvé");
  }

  const passwordMatch = await bcrypt.compare(password, utilisateur.password);
  if (!passwordMatch) {
    throw new Error("Mot de passe incorrect");
  }

  // Générer un token JWT
  const token = jwt.sign(
    { id: utilisateur.id, email: utilisateur.email, role: utilisateur.role },
    SECRET_KEY,
    { expiresIn: '1d' }
  );

  return {
    utilisateur: {
      id: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      role: utilisateur.role
    },
    token
  };
};


// ✅ Logout (si stockage dans cookie, tu videras côté contrôleur)
const logout = async () => {
  // Rien à faire côté service si JWT stateless
  return true;
};


// ✅ Register
const register = async (data) => {
  const existing = await Utilisateur.findOne({ where: { email: data.email } });
  if (existing) {
    throw new Error("Email déjà utilisé");
  }
  return await createUtilisateur(data);
};


// ✅ Obtenir utilisateur actuel via son ID (issu du JWT)
const getCurrentUser = async (userId) => {
  const utilisateur = await Utilisateur.findByPk(userId, {
    attributes: { exclude: ['motdepasse'] }
  });

  if (!utilisateur) {
    throw new Error("Utilisateur non trouvé");
  }

  return utilisateur;
};


// 🔄 Export des fonctions du service
module.exports = {
  createUtilisateur,
  getAllUtilisateurs,
  getUtilisateurById,
  getUtilisateurByEmail,
  getUtilisateurByMatricule,
  updateUtilisateur,
  deleteUtilisateur,
  login, logout, register, getCurrentUser
};
