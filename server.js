// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "[WARN] OPENAI_API_KEY n'est pas défini. Le bot ne pourra pas répondre."
  );
}

const app = express();

// --- CORS sécurisé (ton site + tests locaux) ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
  "https://elanpourtous.github.io"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (ex: curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn("[CORS] Origine non autorisée :", origin);
      return callback(null, false);
    }
  })
);

app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- Routes simples de test ---
app.get("/", (req, res) => {
  res.send("🤖 Élan Bot est en ligne (backend Render ok).");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// --- Route principale de chat ---
app.post("/chat", async (req, res) => {
  const { message } = req.body || {};

  if (!message || typeof message !== "string") {
    return res
      .status(400)
      .json({ error: "Message utilisateur manquant ou invalide." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "Clé OpenAI manquante côté serveur." });
  }

  try {
    const systemPrompt = `
Tu es **Tom Élan**, assistant virtuel d'“Élan pour tous”, une structure située à Saumur (France),
spécialisée dans :

- l'inclusion numérique et professionnelle,
- l'accompagnement de personnes en situation de handicap,
- la formation aux bases du numérique, à la bureautique et à l’accessibilité (RGAA, lecteurs d'écran, dictée vocale, etc.).

Règles de réponse :

1. Tu réponds **en français**, avec un ton clair, simple et bienveillant.
2. Quand c'est utile, tu peux reformuler en **FALC (Facile à lire et à comprendre)** :
   - phrases courtes,
   - mots simples,
   - une idée par phrase.
3. Tu aides les visiteurs à :
   - comprendre les formations et ateliers,
   - s’orienter (test de compétences, diagnostic, besoins),
   - poser des questions sur l’accessibilité, les adaptations possibles, et l’accompagnement.
4. Tu peux suggérer de passer par :
   - la page **Contact** du site,
   - ou l’adresse mail **elanpourtous49@gmail.com**
   quand un échange plus détaillé est nécessaire.
5. Tu expliques clairement que tu es un **assistant IA** et pas un professionnel de santé, du droit ou des finances :
   - Pour les questions médicales, juridiques ou d’aides financières, tu encourages à contacter un professionnel ou les services compétents.
6. Tu restes poli, encourageant, tu ne juges jamais la personne, tu valorises les petits pas et la progression pas à pas.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 500,
      top_p: 0.9,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ??
      "Je suis là, mais je n’ai pas réussi à formuler une réponse. Tu peux reformuler ta question ou passer par la page Contact.";

    res.json({ reply });
  } catch (err) {
    console.error("[CHAT ERROR]", err);
    res.status(500).json({
      error:
        "Erreur interne du bot. Réessaie plus tard ou utilise la page Contact."
    });
  }
});

// --- Démarrage serveur ---
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🤖 Bot Élan pour tous prêt sur le port ${port}`);
});
