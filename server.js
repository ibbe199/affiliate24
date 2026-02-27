import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Root Route (يحل مشكلة Not Found)
app.get("/", (req, res) => {
  res.send("Affiliate24 API is running...");
});

// ✅ فحص إذا المفتاح غير موجود
if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is missing!");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ Generate Brief Endpoint
app.post("/generate-brief", async (req, res) => {
  try {
    const { keyword, type } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }

    const prompt = `
Create a detailed SEO content brief for:
Keyword: ${keyword}
Article Type: ${type || "Review"}

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
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Error generating brief" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
