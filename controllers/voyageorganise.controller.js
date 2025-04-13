const voyageService = require("../services/voyageOrganise.service");
const facebookService = require("../services/facebook.service");

// ✅ Créer un voyage
const create = async (req, res) => {
  try {
    const newVoyage = await voyageService.createVoyage(req.body);

    // Préparer les données du post pour Facebook
    const postData = {
      message: `Voyage organisé : ${newVoyage.titre}! Découvrez ce voyage incroyable à ${newVoyage.destination}.`,
      link: `http://localhost:3000/api/v1/voyages/${newVoyage.id}`,
      picture: newVoyage.image,  // Assure-toi que l'URL de l'image soit valide
      description: newVoyage.description
    };

    // Publier sur Facebook
    const pageId = '542220858985143';  // Remplace avec l'ID de ta page Facebook
    await facebookService.postOnFacebookPage(pageId, postData);

    res.status(201).json(newVoyage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du voyage", error: error.message });
  }
};



// ✅ Récupérer tous les voyages (avec recherche, pagination, tri)
const getAll = async (req, res) => {
  try {
    const voyages = await voyageService.getAllVoyages(req.query);
    res.status(200).json(voyages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
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

const publishVoyage = async (req, res) => {
  try {
    const voyageId = req.params.id;
    const voyage = await voyageService.getVoyageById(voyageId);

    if (!voyage) {
      return res.status(404).json({ message: "Voyage non trouvé" });
    }

    // Préparer les données pour Facebook
    const message = `Voyage organisé : ${voyage.titre}!`;
    const pictureUrl = voyage.image || 'https://default-image-url.com';  // Image par défaut
    const link = `http://localhost:3000/api/v1/voyages/${voyage.id}`;
    const description = `Rejoignez-nous pour un voyage inoubliable à ${voyage.destination}.`;

    // Appeler le service Facebook pour publier
    const facebookResponse = await facebookService.postToFacebook(message, pictureUrl, link, description);

    // Retourner la réponse avec l'ID et le lien du post Facebook
    res.status(200).json({
      facebookPostId: facebookResponse.id,
      facebookPostLink: facebookResponse.link
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la publication sur Facebook", error: error.message });
  }
};
// 🔄 Export
module.exports = {
  create,
  getAll,
  getById,
  update,
    deletee,
  publishVoyage,
};
