// server.js — Bot Élan pour tous (mode démo, sans IA)

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Petit test de vie
app.get("/", (req, res) => {
  res.send("Tom Élan — bot démo sans IA est en ligne ✅");
});

// Route principale du chat
app.post("/chat", (req, res) => {
  const message = (req.body?.message || "").trim();

  if (!message) {
    return res.status(400).json({ error: "Message manquant dans la requête." });
  }

  const lower = message.toLowerCase();
  let reply = "";

  // Quelques réponses “intelligentes” mais locales
  if (/(bonjour|salut|hello|coucou)/.test(lower)) {
    reply =
      "Bonjour, je suis Tom Elan, l’assistant d’Élan pour tous (version démo sans IA). " +
      "Je peux t’indiquer où trouver les formations, l’orientation ou la page de contact.";
  } else if (/formation|atelier|test|bilan/.test(lower)) {
    reply =
      "Tu as une question sur les formations ou les ateliers. " +
      "Sur le site, regarde la page « Formations » ou « Orientation & tests ». " +
      "Si tu veux une réponse adaptée à ta situation, passe par la page Contact.";
  } else if (/handicap|accessib|rgaa|malvoyant|dys|pmr/.test(lower)) {
    reply =
      "Tu parles d’accessibilité ou de handicap. " +
      "Chez Élan pour tous, on peut adapter le rythme, les supports (FALC, lecteurs d’écran, dictée vocale, etc.). " +
      "Le mieux est d’expliquer ta situation dans le formulaire de contact pour qu’on puisse proposer quelque chose sur-mesure.";
  } else if (/contact|email|téléphone|telephone|appel/.test(lower)) {
    reply =
      "Pour nous joindre :\n" +
      "- Email : elanpourtous49@gmail.com\n" +
      "- Téléphone : 07 83 33 67 57\n" +
      "- Ou directement via la page « Contact » du site.";
  } else {
    // Réponse générique
    reply =
      `Tu m’as envoyé : « ${message} ».\n\n` +
      "Je suis la version démo de Tom (sans IA connectée pour l’instant). " +
      "Pour une vraie réponse personnalisée, utilise la page Contact du site ou envoie un email à elanpourtous49@gmail.com.";
  }

  return res.json({ reply });
});

// Port local ou Render
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🤖 Bot Élan pour tous (mode démo, sans IA) sur le port ${port}`);
});
