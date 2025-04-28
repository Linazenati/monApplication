const path = require('path');
const axios = require('axios');
const { PAGE_ACCESS_TOKEN, GRAPH_API_VERSION , PAGE_ID } = require('../config/facebook.config');

const { publishToFacebook , getPublications,recupererCommentaires,supprimerCommentaire, masquerCommentaire,repondreCommentaire } = require('../services/facebook.service');

const { VoyageOrganise } = require('../models');

// ✅ Publier un voyage sur Facebook
const publierSurFacebook = async (req, res) => {
  try {
    const { id } = req.params;

    const voyage = await VoyageOrganise.findByPk(id);
    if (!voyage) {
      console.error('Voyage non trouvé');
      return res.status(404).json({ message: "Voyage introuvable" });
    }

    console.log('Voyage récupéré :', voyage);

    // 🛑 Vérifier s’il est déjà publié
    if (voyage.facebook_post_id) {
      return res.status(400).json({ message: 'Ce voyage a déjà été publié sur Facebook.' });
    }

    // ✅ Parse le champ image (un seul tableau JSON stringifié)
    let images = [];
    try {
      if (voyage.image) {
        images = JSON.parse(voyage.image);
        console.log("Images après parsing : ", images);

        if (!Array.isArray(images)) {
          throw new Error("Les images ne sont pas dans un tableau valide");
        }
      } else {
        throw new Error("Aucune image trouvée dans le voyage");
      }
    } catch (error) {
      console.error("Erreur lors du parsing des images :", error.message);
      return res.status(400).json({ message: 'Le format des images est incorrect' });
    }

    // ✅ Génère les chemins locaux des images
    const localImagePaths = images.map(image =>
      path.join(__dirname, '..', 'public', 'images', image)
    );
    console.log('📸 Chemins des images locales :', localImagePaths);

    // ✅ Message à publier
    const message = `🌍 Nouveau voyage : ${voyage.titre}
📍 Destination : ${voyage.destination}
💰 Prix : ${voyage.prix} €
📅 Date de départ : ${voyage.date_de_depart}
📝 Description : ${voyage.description}`;

    // ✅ Publication sur Facebook
    const result = await publishToFacebook(voyage ,message, localImagePaths);
    console.log('📨 Réponse Facebook :', result);

    // ✅ Enregistrement du post_id dans la BDD
    voyage.facebook_post_id = result.post_id || result.id;
    await voyage.save();

    res.status(200).json({
      message: 'Voyage publié sur Facebook !',
      postId: result.post_id || result.id
    });

  } catch (err) {
    console.error('❌ Erreur :', err.message);
    res.status(500).json({ message: err.message });
  }
};

//recuperer tous les publications 
const getAllPublications = async (req, res) => {
  try {
    const publications = await getPublications();
    res.status(200).json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📝 Récupérer les commentaires d'une publication
const recupererCommentairesPublication = async (req, res) => {
  const { facebook_post_id } = req.params;
const cleanPostId = facebook_post_id.trim(); // Supprimer les espaces et retours à la ligne

console.log('ID de la publication Facebook:', cleanPostId);

try {
  if (!cleanPostId) {
    return res.status(400).json({ message: 'Le facebook_post_id est nécessaire pour récupérer les commentaires' });
  }

    // Récupérer les commentaires en fonction de facebook_post_id
    const commentaires = await recupererCommentaires(facebook_post_id);  // Appeler la fonction pour récupérer les commentaires
    res.status(200).json(commentaires);  // Retourner les commentaires
  } catch (error) {
    res.status(500).json({ message: error.message });  // Gestion des erreurs
  }
};

// 📝 Répondre à un commentaire
const repondreAuCommentaire = async (req, res) => {
  const { commentId } = req.params;
  const { message } = req.body; // Message de la réponse
  console.log('🔍 Suppression du commentaire Facebook...');
  console.log('🆔 Commentaire ID reçu :', commentId);

  try {
    const reponse = await repondreCommentaire(commentId, message);
    res.status(200).json(reponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📝 Supprimer un commentaire
const supprimerCommentairePublication = async (req, res) => {
  const { commentId } = req.params;
  console.log('🔍 Suppression du commentaire Facebook...');
  console.log('🆔 Commentaire ID reçu :', commentId);
  try {
    const reponse = await supprimerCommentaire(commentId);
    res.status(200).json(reponse);
  } catch (error) {
    console.error('🚫 Erreur finale renvoyée au client :', error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📝 Masquer un commentaire
const masquerCommentairePublication = async (req, res) => {
const { commentId } = req.params; // 🔁 Au lieu de req.params
  console.log('🆔 Commentaire ID reçu :', commentId);

  if (!commentId) {
    return res.status(400).json({ message: "commentId manquant" });
  }
  try {
    const result = await masquerCommentaire(commentId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    publierSurFacebook,
    recupererCommentairesPublication,
    getAllPublications,
    repondreAuCommentaire,
    supprimerCommentairePublication,
    masquerCommentairePublication,
};
