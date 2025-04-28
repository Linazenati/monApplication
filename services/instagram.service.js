const path = require('path');  // Assurez-vous que cette ligne est présente
const axios = require('axios');
const { IG_USER_ID, IG_ACCESS_TOKEN, GRAPH_API_VERSION } = require('../config/instagram.config');

// Étape 1 : Créer les containers pour chaque image
const createMediaContainer = async (imageUrl, caption) => {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${IG_USER_ID}/media`;
  const response = await axios.post(url, {
    image_url: imageUrl,  // Utilisation de l'URL publique de l'image
    caption,
    access_token: IG_ACCESS_TOKEN
  });
  return response.data.id;
};

// Étape 2 : Publier un carrousel avec plusieurs containers
const publishCarouselToInstagram = async (caption, imageFilenames) => {
  try {
    // Assurez-vous que les images sont accessibles publiquement via une URL sur votre serveur
    const imageUrls = imageFilenames.map(name => `https://localhost:3000/public/images/${name}`);  // URL publique

    // Créer les containers pour chaque image
    const containerIds = [];
    for (const imageUrl of imageUrls) {
      const containerId = await createMediaContainer(imageUrl, caption);  // Publier chaque image via son URL
      containerIds.push({ media_product_id: containerId });
    }

    // Créer le post carrousel
    const carouselUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${IG_USER_ID}/media`;
    const response = await axios.post(carouselUrl, {
      access_token: IG_ACCESS_TOKEN,
      caption,
      children: containerIds.map(c => c.media_product_id),
      media_type: 'CAROUSEL'
    });

    const creationId = response.data.id;

    // Publier le carrousel
    const publishUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${IG_USER_ID}/media_publish`;
    const publishResponse = await axios.post(publishUrl, {
      creation_id: creationId,
      access_token: IG_ACCESS_TOKEN
    });

    return { post_id: publishResponse.data.id };
  } catch (error) {
    console.error("❌ Erreur Instagram :", error.response?.data || error.message);
    throw new Error("Échec de la publication sur Instagram");
  }
};

module.exports = {
  publishCarouselToInstagram
};
