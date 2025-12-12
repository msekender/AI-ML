import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col">
      {/* Hero */}
      <header className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            🎬 Hollywood Movie AI
          </h1>

          <p className="text-lg text-slate-400">
            An AI-powered assistant that answers questions about Hollywood movies
            using real metadata and intelligent reasoning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chat"
              className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium hover:bg-blue-500 transition"
            >
              Try Live Demo
            </Link>

            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              className="inline-block rounded-xl border border-slate-700 px-6 py-3 text-sm text-slate-300 hover:bg-slate-800 transition"
            >
              Powered by TMDB
            </a>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-2">🎭</div>
            <h3 className="font-semibold mb-1">Cast & Crew</h3>
            <p className="text-sm text-slate-400">
              Get accurate information about actors, directors, and key crew members.
            </p>
          </div>

          <div>
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="font-semibold mb-1">AI-Powered Answers</h3>
            <p className="text-sm text-slate-400">
              Natural language answers powered by a large language model.
            </p>
          </div>

          <div>
            <div className="text-3xl mb-2">🎞</div>
            <h3 className="font-semibold mb-1">Similar Movies</h3>
            <p className="text-sm text-slate-400">
              Discover related movies based on genre, themes, and popularity.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-6">
        Data provided by TMDB · AI responses powered by Groq · Demo project
      </footer>
    </div>
  );
}
