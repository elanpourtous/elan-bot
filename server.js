// server.js - version test sans OpenAI

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route de test simple
app.get("/", (req, res) => {
  res.send("✅ Élan-bot est en ligne (version test sans IA).");
});

// Route /chat qui répond en dur
app.post("/chat", (req, res) => {
  const { message } = req.body || {};
  console.log("Message reçu :", message);

  res.json({
    reply:
      "Bonjour, je suis Tom (version démo sans IA). " +
      "Tu m'as envoyé : " +
      (message || "rien"),
  });
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🚀 Serveur Élan-bot (test) lancé sur le port ${port}`);
});
