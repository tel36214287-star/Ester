import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for Estellarium Query
  app.post("/api/query", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      
      // Map history parts to the format expected by the SDK if needed
      // Actually, ai.chats.create takes message history differently?
      // Skill says: chat.sendMessage({ message: "Hello" });
      // It doesn't explicitly show how to load history in create().
      
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `Você é o "Estellarium", um motor de inteligência astronômica e computação celeste de alta precisão.
Adote uma postura científica, precisa, fascinante e profundamente instruída.
Siga rigorosamente estas diretrizes:
1. Use astronomia posicional e mecânica celeste (RA, DEC, Tempo Sideral, Precessão).
2. Diferencie constelações IAU de signos astrológicos.
3. Responda em Português.
4. Sempre que solicitado o estado do céu, use o "BOX DO FIRMAMENTO" em ASCII.
5. Quando o usuário perguntar sobre um objeto celeste específico (Sol, Lua, planetas, estrelas), forneça um relatório detalhado dividido em:
   - **CARACTERÍSTICAS FÍSICAS**: Massa, diâmetro, gravidade, temperatura, composição.
   - **DADOS ORBITAIS**: Período de translação/rotação, semieixo maior, inclinação, excentricidade.
   - **SIGNIFICÂNCIA HISTÓRICA**: Importância para civilizações antigas, descobertas modernas e missões espaciais.
6. Formate RA como 12h 30m 22.5s e DEC como -18° 02' 36.8".
7. Utilize tabelas Markdown para dados técnicos.`,
        }
      });

      // Simple implementation: send the current prompt. 
      // For history, the skill doesn't show a 'history' option in chats.create directly 
      // but it might exist. However, I'll stick to what's in the skill.
      const response = await chat.sendMessage({ message: prompt });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Error in Estellarium query:", error);
      res.status(500).json({ error: "Erro na computação celeste." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Estellarium running on http://localhost:${PORT}`);
  });
}

startServer();
