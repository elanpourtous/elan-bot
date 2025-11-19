import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route de test (GET /)
app.get("/", (req, res) => {
  res.send("🤖 Élan Bot est en ligne.");
});

// Route principale de chat
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message utilisateur manquant." });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Tu es l’assistant d'Élan pour tous. Tu aides les visiteurs à s’orienter, comprendre les formations, les services et à poser des questions sur le handicap et l’inclusion. Tu réponds en français, simplement, de façon bienveillante.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices?.[0]?.message?.content ?? "Je n’ai pas de réponse pour le moment.";
    res.json({ reply });
  } catch (err) {
    console.error("Erreur OpenAI :", err);
    res.status(500).json({ error: "Erreur serveur avec le bot." });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🤖 Bot Élan pour tous prêt sur le port ${port}`);
});
