const utilisateurService = require("../services/utilisateur.service")

module.exports.login = async (req, res) => {
  try {
    const response = await utilisateurService.login( req.body );
    res.status(201).json( { success:true, data:response } );
  } catch (error) {
    res.status(500).json({ success:false, data: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.status(201).json("OK - Logout");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.register = async (req, res) => {
  try {
    const response = await utilisateurService.register( req.body );

    res.status(201).json({ success: true, data: response });
    console.log("BODY reçu :", req.body);

  } catch (error) {
    res.status(500).json({ success:false, message: error.message });
  }
};

module.exports.currentUser = async (req, res) => {
  try {
    
    res.status(201).json("OK - CurrentUser");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};