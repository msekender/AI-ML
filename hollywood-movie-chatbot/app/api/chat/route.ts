import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const TMDB_API_BASE = "https://api.themoviedb.org/3";

/* =========================
   Types
========================= */

type MovieInfo = {
  title: string;
  year: string;
  director?: string;
  genres: string[];
  cast: string[];
  overview?: string;
  posterPath?: string | null;
};

type SimilarMovie = {
  id: number;
  title: string;
  year: string;
};

/* =========================
   Helpers
========================= */

// Extract movie title from natural language
function extractMovieSearchQuery(message: string): string {
  const trimmed = message.trim();

  // Quoted title: "Titanic"
  const quoted = trimmed.match(/"([^"]+)"/);
  if (quoted?.[1]) return quoted[1];

  const cleaned = trimmed.replace(/[?.!]+$/g, "");
  const lower = cleaned.toLowerCase();

  const patterns = [
    "who acted in",
    "who starred in",
    "who stars in",
    "cast of",
    "who directed",
    "director of",
    "genre of",
    "what is the genre of",
    "story of",
    "plot of",
    "about",
  ];

  for (const p of patterns) {
    const idx = lower.indexOf(p);
    if (idx !== -1) {
      return cleaned.slice(idx + p.length).trim();
    }
  }

  return cleaned;
}

/* =========================
   TMDB Integration
========================= */

async function fetchMovieFromTmdb(
  userMessage: string,
  tmdbKey: string
): Promise<{
  context: string;
  movie: MovieInfo;
  similarMovies: SimilarMovie[];
} | null> {
  try {
    const query = extractMovieSearchQuery(userMessage);
    console.log("TMDB search query:", query);

    // 1️⃣ Search movie
    const searchRes = await fetch(
      `${TMDB_API_BASE}/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(
        query
      )}&include_adult=false`
    );

    if (!searchRes.ok) return null;

    const searchJson = await searchRes.json();
    const first = searchJson.results?.[0];
    if (!first) return null;

    const movieId = first.id;

    // 2️⃣ Details + credits
    const detailsRes = await fetch(
      `${TMDB_API_BASE}/movie/${movieId}?api_key=${tmdbKey}&append_to_response=credits`
    );

    if (!detailsRes.ok) return null;

    const d = await detailsRes.json();

    const movie: MovieInfo = {
      title: d.title,
      year: d.release_date ? d.release_date.slice(0, 4) : "Unknown",
      director: d.credits?.crew?.find((c: any) => c.job === "Director")?.name,
      genres: (d.genres ?? []).map((g: any) => g.name),
      cast: (d.credits?.cast ?? []).slice(0, 5).map((c: any) => c.name),
      overview: d.overview ?? "",
      posterPath: d.poster_path
        ? `https://image.tmdb.org/t/p/w500${d.poster_path}`
        : null,
    };

    // 3️⃣ Similar movies
    const similarRes = await fetch(
      `${TMDB_API_BASE}/movie/${movieId}/similar?api_key=${tmdbKey}`
    );

    let similarMovies: SimilarMovie[] = [];
    if (similarRes.ok) {
      const s = await similarRes.json();
      similarMovies = (s.results ?? []).slice(0, 6).map((m: any) => ({
        id: m.id,
        title: m.title,
        year: m.release_date ? m.release_date.slice(0, 4) : "Unknown",
      }));
    }

    // Context for LLM
    let context = `MOVIE FACTS FROM TMDB\n`;
    context += `Title: ${movie.title}\n`;
    context += `Year: ${movie.year}\n`;
    if (movie.director) context += `Director: ${movie.director}\n`;
    if (movie.genres.length) context += `Genres: ${movie.genres.join(", ")}\n`;
    if (movie.cast.length) context += `Top cast: ${movie.cast.join(", ")}\n`;
    if (movie.overview) context += `Overview: ${movie.overview}\n`;
    if (similarMovies.length) {
      context += `Similar movies: ${similarMovies
        .map((m) => `${m.title} (${m.year})`)
        .join(", ")}\n`;
    }

    console.log("TMDB movie:", movie.title);
    return { context, movie, similarMovies };
  } catch (err) {
    console.error("TMDB error:", err);
    return null;
  }
}

/* =========================
   API Route
========================= */

export async function POST(req: Request) {
  try {
    const groqKey = process.env.GROQ_API_KEY;
    const tmdbKey = process.env.TMDB_API_KEY;

    if (!groqKey) {
      return NextResponse.json(
        { reply: "Server misconfiguration: GROQ_API_KEY missing." },
        { status: 500 }
      );
    }

    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json(
        { reply: "Please enter a valid question." },
        { status: 400 }
      );
    }

    let movie: MovieInfo | null = null;
    let similarMovies: SimilarMovie[] = [];
    let tmdbContext: string | null = null;

    if (tmdbKey) {
      const result = await fetchMovieFromTmdb(message, tmdbKey);
      if (result) {
        movie = result.movie;
        similarMovies = result.similarMovies;
        tmdbContext = result.context;
      }
    }

    const messages: any[] = [
      {
        role: "system",
        content:
          "You are a Hollywood movie assistant. Use provided factual data. Do not hallucinate.",
      },
    ];

    if (tmdbContext) {
      messages.push({
        role: "system",
        content: tmdbContext,
      });
    }

    messages.push({
      role: "user",
      content: message,
    });

    const llmRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.4,
      }),
    });

    if (!llmRes.ok) {
      return NextResponse.json(
        { reply: "LLM service error." },
        { status: 500 }
      );
    }

    const llmJson = await llmRes.json();
    const reply =
      llmJson?.choices?.[0]?.message?.content ??
      "I could not generate an answer.";

    return NextResponse.json({
      reply,
      movie,
      similarMovies,
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { reply: "Unexpected server error." },
      { status: 500 }
    );
  }
}