const utilisateurService = require("../services/utilisateur.service")

module.exports.login = async (req, res) => {
  try {
    const response = await utilisateurService.login( req.body );
    res.status(201).json( { success:true, data:response } );
  } catch (error) {
    res.status(404).json({ success:false, data: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const response = await utilisateurService.logout( req.body );
    res.status(201).json("OK - Logout");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.register = async (req, res) => {
  try {
    const data = {
      ...req.body,
      role: 'Utilisateur_inscrit'
    };
    const utilisateur = await utilisateurService.register(data);
    res.status(201).json({ success: true, data: utilisateur });

  } catch (error) {
    console.error("❌ Erreur attrapée dans register controller :", error.message); // ✅ visible dans console
    res.status(400).json({ success: false, message: error.message }); // ✅ visible dans le front ou Postman
  }
};


module.exports.currentUser = async (req, res) => {
  try {
    
    res.status(201).json("OK - CurrentUser");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};