<<<<<<< HEAD
// server.js — Bot Élan pour tous (mode démo, sans IA)

=======
>>>>>>> 77bd2904082ee92381c096760179588b1e1b8705
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

<<<<<<< HEAD
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
=======
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
>>>>>>> 77bd2904082ee92381c096760179588b1e1b8705
});

// Port local ou Render
const port = process.env.PORT || 10000;
app.listen(port, () => {
<<<<<<< HEAD
  console.log(`🤖 Bot Élan pour tous (mode démo, sans IA) sur le port ${port}`);
=======
  console.log(`🤖 Bot Élan pour tous (avec OpenAI) prêt sur le port ${port}`);
>>>>>>> 77bd2904082ee92381c096760179588b1e1b8705
});
