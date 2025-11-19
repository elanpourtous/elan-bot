// server.js - avec OpenAI, version robuste

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Route de santé
app.get("/", (req, res) => {
  res.send("✅ Élan-bot est en ligne avec OpenAI.");
});

// 🔑 On vérifie la clé AVANT de lancer le client
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY manquante. Définis-la dans Render > Environment.");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message } = req.body || {};
  console.log("Message reçu :", message);

  if (!message) {
    return res.status(400).json({ error: "Message manquant" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error:
        "OPENAI_API_KEY n’est pas configurée côté serveur. Contactez l’admin (Patrick 😎).",
    });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Tu es l’assistant d'Élan pour tous. Tu aides les visiteurs à s’orienter, à comprendre les formations et à poser des questions sur le handicap et l’inclusion.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices?.[0]?.message?.content || "Je n’ai pas de réponse pour le moment.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Erreur OpenAI :", err);
    res.status(500).json({
      error: "Erreur lors de l’appel à l’API OpenAI.",
    });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🤖 Bot Élan pour tous lancé sur le port ${port}`);
});
