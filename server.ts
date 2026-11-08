import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API route to generate poetry / shayari / quotes
app.post('/api/generate-poetry', async (req, res) => {
  try {
    const {
      genre = 'sad',
      language = 'urdu',
      authorStyle = 'faiz',
      customPrompt = '',
      linesCount = 2,
    } = req.body;

    const systemPrompt = `You are an expert Urdu and romantic/aesthetic poet and literature curator.
The user wants aesthetic poetry formatted specifically for short-form 9:16 videos (TikTok, Instagram Reels, YouTube Shorts).
Requirements:
1. Provide concise, emotionally poignant lines (between 2 to 4 lines).
2. If language is Urdu: provide the primary poetry in authentic Urdu Nastaliq script, followed by an accurate English translation or Roman Urdu transcription if helpful.
3. If language is Roman Urdu: write in stylish phonetic Roman Urdu.
4. If language is English: write deeply aesthetic, poetic, evocative verses.
5. Return JSON format with:
   - "poetry": The main lines to be displayed in the video (each line separated by newline "\\n")
   - "title": A short 2-3 word aesthetic title/tag
   - "author": Attributed poet or original style
   - "englishTranslation": English translation if applicable
   - "suggestedMusic": One of ["Aesthetic Lofi", "Sad Piano", "Romantic Flute", "Sufi Ambient", "Nostalgic Acoustic"]
   - "suggestedMotion": One of ["Slow Zoom-In", "Cold Breeze Sway", "Human Walk Drift"]`;

    const userPrompt = `Generate a ${genre} poetry/quote in ${language} language, in the poetic mood of ${authorStyle}. ${customPrompt ? `Special theme or thought: ${customPrompt}` : ''}. Keep it around ${linesCount} lines, aesthetic and rhythmic.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        poetry: text.replace(/^```json|```$/g, '').trim(),
        title: 'Aesthetic Verse',
        author: authorStyle,
      };
    }

    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating poetry:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate poetry from AI',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Dev or Production Vite server integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
