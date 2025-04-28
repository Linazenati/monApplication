
const utilisateurRouter = require("./utilisateur.router");
const voyageRouter = require("./voyageorganise.router");
const facebookRouter = require("./facebook.router");
const authRouter = require("./auth.router");
const instagramRouter = require("./instagram.router");


module.exports = (app) => {

      // 🔐 Auth (login/register)
    app.use("/api/v1/auth", authRouter);

      // 👤 Utilisateurs protégés par JWT
    app.use("/api/v1/utilisateurs", utilisateurRouter);
  
  
    // 🧳 Voyages organisés (accessibles sans token pour l’instant)
    app.use("/api/v1/voyages", voyageRouter);

     // Routes pour Facebook
    app.use("/api/v1/facebook", facebookRouter); 
  
      // Routes pour Instagram
    app.use("/api/v1/instagram", instagramRouter); 


      // 📍 Catch all pour les routes non définies dans /api/v1
    app.use("/api/v1/", (req, res) => {
        res.json({ Error: true, msg: "Linaa Bonjour" })
    });

  // 🌍 Catch all général (hors /api/v1) – utile pour SPA ou test
    app.use("/*", (req, res) => {
        res.json({ msg:"Hi" })
    });
}
    
