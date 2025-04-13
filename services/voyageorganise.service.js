const { VoyageOrganise } = require('../models');
const { Op } = require("sequelize");

// ✅ Créer un nouveau voyage organisé
const createVoyage = async (data) => {
  return await VoyageOrganise.create(data);
};

// ✅ Récupérer tous les voyages organisés avec recherche, pagination et tri
const getAllVoyages = async ({
  search = "",
  limit = 50,
  offset = 0,
  orderBy = "createdAt",
  orderDir = "DESC"
} = {}) => {
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { titre: { [Op.like]: `%${search}%` } },
      { destination: { [Op.like]: `%${search}%` } },
      { type: { [Op.like]: `%${search}%` } }, // si tu as un champ "type" par exemple
    ];
  }

  return await VoyageOrganise.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[orderBy, orderDir]],
  });
};

// ✅ Récupérer un voyage par son ID
const getVoyageById = async (id) => {
  return await VoyageOrganise.findByPk(id);
};

// ✅ Mettre à jour un voyage
const updateVoyage = async (id, data) => {
  const voyage = await VoyageOrganise.findByPk(id);
  if (!voyage) {
    throw new Error('Voyage non trouvé');
  }
  return await voyage.update(data);
};

// ✅ Supprimer un voyage
const deleteVoyage = async (id) => {
  const voyage = await VoyageOrganise.findByPk(id);
  if (!voyage) {
    throw new Error('Voyage non trouvé');
  }
  return await voyage.destroy();
};

// ✅ Publier un voyage sur Facebook
const publishVoyage = async (pageId, voyage) => {
  // Préparer les données du post pour Facebook
  const postData = {
    message: `Voyage organisé : ${voyage.titre}! Découvrez ce voyage incroyable à ${voyage.destination}.`,
    link: `https://www.votre-site.com/voyage/${voyage.id}`,  // URL du voyage
    picture: voyage.image,  // Assurez-vous que l'URL de l'image est valide
    description: voyage.description,
  };

  try {
    // Appel du service Facebook pour publier sur la page
    const response = await facebookService.postOnFacebookPage(pageId, postData);
    return response;  // Renvoie l'ID de la publication si tout se passe bien
  } catch (error) {
    throw new Error(`Erreur lors de la publication sur Facebook: ${error.message}`);
  }
};

// 🔄 Export des fonctions du service
module.exports = {
  createVoyage,
  getAllVoyages,
  getVoyageById,
  updateVoyage,
  deleteVoyage,
  publishVoyage,
};
