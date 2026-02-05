import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

app.get("/", (req, res) => {
  res.send("ScriptWorks Coding AI backend is running.");
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    const response = await fetch("https://api.apifree.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: "You are ScriptWorks Coding AI, a helpful coding assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("APIFree response:", data);

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: { message: "Error calling APIFree API" } });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

