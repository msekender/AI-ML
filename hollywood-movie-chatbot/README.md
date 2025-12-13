# 🎬 Hollywood Movie AI Chatbot

An AI-powered web application that answers questions about Hollywood movies using **real movie metadata** and **intelligent natural-language reasoning**.

Users can ask about:
- 🎭 Cast & crew
- 🎬 Directors
- 🗂 Genres & release years
- 📖 High-level plot summaries
- 🎞 Similar movie recommendations

The application combines **TMDB movie data** with a **large language model (LLM)** to provide accurate, human-friendly answers.

---

## 🌐 Live Demo

👉 **Live URL:** *(Vercel deployment)*  
`https://ai-7pouu0l7p-zulfiqer-sekenders-projects.vercel.app/`

- `/` → Landing page  
- `/chat` → Interactive movie chatbot  

---

## 🧠 How It Works (High Level)

1. User asks a movie-related question in natural language  
2. The backend:
   - Extracts the movie title from the question
   - Fetches factual data from **TMDB**
   - Injects that data into an **LLM prompt**
3. The LLM generates a grounded, human-readable response
4. The UI displays:
   - Chat response
   - Movie details card (poster, cast, genres)
   - Similar movie recommendations

This avoids hallucinations and keeps answers fact-based.

---

## 🛠 Tech Stack

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**

### Backend
- **Next.js API Routes**
- **Groq LLM API**
- **TMDB API**

### Deployment
- **Vercel** (free tier)

---

## 📂 Project Structure

```text
hollywood-movie-chatbot/
├── app/
│   ├── page.tsx
│   ├── chat/page.tsx
│   └── api/chat/route.ts
├── public/
├── package.json
├── next.config.ts
└── README.md
```

---

## 🔑 Environment Variables

```env
GROQ_API_KEY=your_groq_api_key
TMDB_API_KEY=your_tmdb_api_key
```

- Do **NOT** commit `.env.local`
- Configure env vars in **Vercel → Project Settings → Environment Variables**

---

## ▶️ Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

---

## ✨ Example Questions

- Who acted in Titanic?
- Who directed The Dark Knight?
- Movies similar to Inception
- What genre is Interstellar?

---

## 📌 Attribution

- Movie data provided by **The Movie Database (TMDB)**
- AI responses powered by **Groq LLM**

This product uses the TMDB API but is not endorsed or certified by TMDB.

---

## 👤 Author

**Zulfiqer Sekender**  
GitHub: https://github.com/msekender
