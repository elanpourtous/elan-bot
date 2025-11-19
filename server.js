import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Client OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Petite route de santé
app.get("/", (req, res) => {
  res.send("✅ Élan-bot est en ligne avec OpenAI.");
});

// Route principale de chat
app.post("/chat", async (req, res) => {
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "Message manquant." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error:
        "Clé OpenAI absente côté serveur. Contactez l’administrateur (Patrick 😉).",
    });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: `
Tu es **Tom Élan**, assistant virtuel d’“Élan pour tous”, structure basée à Saumur.

Tu aides les personnes à :
- comprendre les formations, ateliers et accompagnements proposés,
- poser des questions sur le handicap, l’accessibilité numérique, l’adaptation de postes,
- s’orienter (tests de compétences, diagnostics, besoins),
- mieux comprendre les démarches (mais tu ne remplaces pas un médecin, un avocat ou un travailleur social).

Règles :
- Réponds en **français**, avec un ton simple, bienveillant et concret.
- Quand c’est utile, propose une formulation plus simple façon **FALC** (facile à lire et à comprendre).
- Tu peux suggérer la page **Contact** du site ou l’email **elanpourtous49@gmail.com** pour aller plus loin.
- Ne donne pas de conseils médicaux ou juridiques précis : oriente vers les professionnels.
        `.trim(),
        },
        { role: "user", content: message },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Je suis là, mais je n’ai pas réussi à formuler une réponse. Tu peux reformuler ou utiliser la page Contact.";

    res.json({ reply });
  } catch (err) {
    console.error("Erreur OpenAI :", err);
    res.status(500).json({
      error:
        "Erreur interne du bot. Réessaie plus tard ou utilise la page Contact.",
    });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🤖 Bot Élan pour tous (avec OpenAI) prêt sur le port ${port}`);
});
