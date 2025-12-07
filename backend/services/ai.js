// backend/services/ai.js
const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate optimized title, bullets, description, keywords
async function optimizeContent(title, bullets, description) {
  const safeTitle = title || "";
  const safeBullets = Array.isArray(bullets) ? bullets : [];
  const safeDescription = description || "";

  const prompt = `
You are an expert Amazon Listing Optimizer.

Original Title:
${safeTitle}

Original Bullet Points:
${safeBullets.length > 0 ? safeBullets.join("\n") : "No bullet points provided. Generate 5 new bullet points based on the title and description."}

Original Description:
${safeDescription}

Your tasks:
1. Rewrite the title to be keyword-rich and readable.
2. Rewrite bullet points (5 bullets). If original bullets are missing, create 5 new bullet points from the description.
3. Rewrite the description to be clear, persuasive, and Amazon compliant.
4. Suggest exactly 5 SEO keywords.

Respond in this JSON format:

{
  "title": "...",
  "bullets": ["...", "..."],
  "description": "...",
  "keywords": ["...", "..."]
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const text = response.choices[0].message.content;

  try {
    const parsed = JSON.parse(text);
    return {
      title: parsed.title || safeTitle,
      bullets: Array.isArray(parsed.bullets) ? parsed.bullets : safeBullets,
      description: parsed.description || safeDescription,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    };
  } catch (err) {
    console.error("JSON Parse Error:", err, "\nAI Returned:", text);
    return {
      title: safeTitle,
      bullets: safeBullets,
      description: safeDescription,
      keywords: [],
    };
  }
}

module.exports = { optimizeContent };
