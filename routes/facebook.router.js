const express = require("express");
const router = express.Router();
const facebookController = require("../controllers/facebook.controller");


//✏️ publier un voyage sur fb  par ID
router.post("/:id/publier", facebookController.publierSurFacebook);

// recuperer tous les publications 
router.get('/publications', facebookController.getAllPublications);

// recuperer tous les commentaires d'une pub
router.get('/:facebook_post_id/commentaires',facebookController.recupererCommentairesPublication)

// ✅ Répondre à un commentaire
router.post('/commentaires/:commentId/repondre',facebookController.repondreAuCommentaire);

// ✅ Supprimer un commentaire
router.delete('/commentaires/:commentId', facebookController.supprimerCommentairePublication);

// ✅ Masquer un commentaire
router.post('/commentaires/:commentId/masquer', facebookController.masquerCommentairePublication);

module.exports = router;
