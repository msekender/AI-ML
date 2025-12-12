'use client';

import { FormEvent, useState } from 'react';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

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

type ApiResponse = {
  reply: string;
  movie?: MovieInfo | null;
  similarMovies?: SimilarMovie[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [movie, setMovie] = useState<MovieInfo | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', content: input },
    ]);

    setIsSending(true);
    setMovie(null);
    setSimilarMovies([]);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data: ApiResponse = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply,
      },
    ]);

    if (data.movie) setMovie(data.movie);
    if (data.similarMovies) setSimilarMovies(data.similarMovies);

    setInput('');
    setIsSending(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <h1 className="text-2xl font-bold tracking-tight">
          🎬 Hollywood Movie AI
        </h1>
        <p className="text-sm text-slate-400">
          Ask about cast, director, genres, plots & similar movies
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Column */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-slate-400 text-sm">
                Try: <em>Who acted in Titanic?</em> or <em>Movies similar to Interstellar</em>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask about a Hollywood movie..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
            />
            <button
              disabled={isSending}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </section>

        {/* Movie Panel */}
        <aside className="space-y-4">
          {movie && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              {movie.posterPath && (
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="rounded-lg mb-4"
                />
              )}

              <h2 className="text-xl font-bold">
                {movie.title}{' '}
                <span className="text-slate-400 text-base">
                  ({movie.year})
                </span>
              </h2>

              {movie.director && (
                <p className="text-sm mt-1 text-slate-300">
                  🎥 Director: <strong>{movie.director}</strong>
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="text-xs px-2 py-1 rounded-full bg-slate-800 border border-slate-700"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {movie.cast.length > 0 && (
                <p className="text-sm mt-3 text-slate-300">
                  ⭐ Cast: {movie.cast.join(', ')}
                </p>
              )}

              {movie.overview && (
                <p className="text-sm mt-3 text-slate-400 leading-relaxed">
                  {movie.overview}
                </p>
              )}
            </div>
          )}

          {similarMovies.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <h3 className="text-sm font-semibold mb-2 text-slate-300">
                🎞 Similar Movies
              </h3>
              <ul className="space-y-2 text-sm">
                {similarMovies.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-lg px-3 py-2 bg-slate-800 hover:bg-slate-700 transition"
                  >
                    {m.title}{' '}
                    <span className="text-slate-400">
                      {m.year !== 'Unknown' ? `(${m.year})` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-4">
        Data powered by TMDB · AI responses by Groq
      </footer>
    </div>
  );
}