const express = require("express");
const router = express.Router();
const instagramController = require("../controllers/instagram.controller");


//✏️ publier un voyage sur fb  par ID
router.post("/:id/publier", instagramController.publierSurInstagram);

module.exports = router;