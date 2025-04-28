const path = require('path');
const axios = require('axios');

const { publishCarouselToInstagram } = require('../services/instagram.service');
const { VoyageOrganise } = require('../models');

// ✅ Publier un voyage sur Facebook ou Instagram
const publierSurInstagram= async (req, res) => {
  try {
    const { id, plateforme } = req.params;  // La plateforme sera soit "facebook" ou "instagram"
    const voyage = await VoyageOrganise.findByPk(id);
    
    if (!voyage) {
      return res.status(404).json({ message: "Voyage introuvable" });
    }

    console.log('Voyage récupéré :', voyage);

    // 🛑 Vérifier s’il est déjà publié
    if (voyage.facebook_post_id || voyage.instagram_post_id) {
      return res.status(400).json({ message: 'Ce voyage a déjà été publié.' });
    }

    // ✅ Parse le champ image (un seul tableau JSON stringifié)
    let images = [];
    try {
      if (voyage.image) {
        images = JSON.parse(voyage.image);
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
    const localImagePaths = images.map(image => path.join(__dirname, '..', 'public', 'images', image));

    // ✅ Message à publier
    const message = `🌍 Nouveau voyage : ${voyage.titre}
📍 Destination : ${voyage.destination}
💰 Prix : ${voyage.prix} €
📅 Date de départ : ${voyage.date_de_depart}
📝 Description : ${voyage.description}`;

  
    // ✅ Publication sur Facebook
    const result = await publishCarouselToInstagram(message, images);
    console.log('📨 Réponse Facebook :', result);

    // ✅ Enregistrement du post_id dans la BDD
    voyage.instagram_post_id = result.post_id || result.id;
    await voyage.save();

    res.status(200).json({
      message: 'Voyage publié sur instagram !',
      postId: result.post_id || result.id
    });
    await voyage.save();

    res.status(200).json({
      postId: result.post_id || result.id
    });

  } catch (err) {
    console.error('❌ Erreur :', err.message);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
publierSurInstagram  
};
