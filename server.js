import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-brief", async (req, res) => {
  try {
    const { keyword, type } = req.body;

    const prompt = `
Create a detailed SEO content brief for:
Keyword: ${keyword}
Article Type: ${type}

Include:
- Optimized H1
- H2 structure
- FAQ section
- CTA suggestions
- Internal linking ideas
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ result: response.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: "Error generating brief" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
