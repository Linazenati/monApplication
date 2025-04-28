// src/app.js

const express = require('express');
const app = express();

require("./middlewares")(app);
require("./routes")(app);
require('dotenv').config();


// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
      console.log(`===========================================`);
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
      console.log(`===========================================`);
});

