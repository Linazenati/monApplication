
const utilisateurRouter = require("./utilisateur.router");
const voyageRouter = require("./voyageorganise.router");
const authRouter = require("./auth.router");

const authenticateToken = require("../middlewares/authMiddleware");

module.exports = (app) => {

      // 🔐 Auth (login/register)
    app.use("/api/v1/auth", authRouter);

      // 👤 Utilisateurs protégés par JWT
    app.use("/api/v1/utilisateurs", authenticateToken, utilisateurRouter);
  
  
    // 🧳 Voyages organisés (accessibles sans token pour l’instant)
    app.use("/api/v1/voyages", voyageRouter);


      // 📍 Catch all pour les routes non définies dans /api/v1
    app.use("/api/v1/", (req, res) => {
        res.json({ Error: true, msg: "Linaa Bonjour" })
    });

  // 🌍 Catch all général (hors /api/v1) – utile pour SPA ou test
    app.use("/*", (req, res) => {
        res.json({ msg:"Hi" })
    });
}
    
