const express = require("express");
const router = express.Router();
const voyageController = require("../controllers/voyageorganise.controller");

// 📥 Créer un nouveau voyage organisé
router.post("/", voyageController.create);

// 📄 Récupérer tous les voyages organisés (optionnel: ?search=...&limit=...&offset=...)
router.get("/", voyageController.getAll);

// 🔍 Récupérer un voyage par son ID
router.get("/:id", voyageController.getById);

// ✏️ Mettre à jour un voyage par ID
router.put("/:id", voyageController.update);

// 🗑️ Supprimer un voyage par ID (appelée "deletee")
router.delete("/:id", voyageController.deletee);

// ✏️ publier un voyage par ID
router.post("/:id/publish", voyageController.publishVoyage);


module.exports = router;
