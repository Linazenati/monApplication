const voyageService = require("../services/voyageorganise.service");
const { VoyageOrganise } = require('../models');

// ✅ Créer un voyage
const create = async (req, res) => {
  try {
    const { titre, destination, prix, date_de_depart, description } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    const voyage = await VoyageOrganise.create({
      titre,
      destination,
      prix,
      date_de_depart,
      description,
      image: JSON.stringify(images), // tu peux aussi stocker dans un autre champ comme `images`
    });

    res.status(201).json(voyage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ Récupérer tous les voyages (avec recherche, pagination, tri)
const getAll = async (req, res) => {
  try {
    // Récupère les paramètres de query dans l'URL (facultatifs)
    const { search, limit, offset, orderBy, orderDir } = req.query;

    const voyages = await voyageService.getAllVoyages({
      search,
      limit,
      offset,
      orderBy,
      orderDir
    });

    res.status(200).json(voyages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Récupérer un seul voyage par ID
const getById = async (req, res) => {
  try {
      const voyage = await voyageService.getVoyageById(req.params.id);
      
    if (!voyage) {
      return res.status(404).json({ message: "Voyage non trouvé" });
    }
    res.status(200).json(voyage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

// ✅ Mettre à jour un voyage
const update = async (req, res) => {
  try {
    const updatedVoyage = await voyageService.updateVoyage(req.params.id, req.body);
    res.status(200).json(updatedVoyage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// ✅ Supprimer un voyage
const deletee= async (req, res) => {
  try {
    await voyageService.deleteVoyage(req.params.id);
    res.status(200).json({ message: "Voyage supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// ✅ publier  un voyage sur fb
const publishToSite = async (req, res) => {
  try {
    const voyageId = req.params.id;
    const voyage = await voyageService.getVoyageById(voyageId);

    if (!voyage) {
      return res.status(404).json({ message: "Voyage non trouvé" });
    }

    // Marquer le voyage comme publié sur le site (exemple : mettre un champ `estPublie: true`)
    const updatedVoyage = await voyageService.updateVoyage(voyageId, { estPublie: true });

    res.status(200).json({
      success: true,
      message: "Voyage publié sur le site",
      voyage: updatedVoyage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la publication du voyage sur le site",
      error: error.message,
    });
  }
};

// 🔄 Export
module.exports = {
  create,
  getAll,
  getById,
  update,
    deletee,
  publishToSite,
};
