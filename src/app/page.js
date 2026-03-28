import Link from 'next/link';

const FEATURES = [
  {
    title: 'Secure authentication',
    description: 'JWT tokens, bcrypt hashing, and OTP email verification — all industry best practices.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    title: 'Email verification',
    description: 'Ensure every account is real with expiring one-time passwords sent via SMTP.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-violet-100 text-violet-600',
  },
  {
    title: 'Protected routes',
    description: 'Middleware-based access control with Edge-compatible JWT verification.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Scalable database',
    description: 'PostgreSQL via Supabase with Prisma ORM — type-safe, migration-ready schema.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    color: 'bg-sky-100 text-sky-600',
  },
  {
    title: 'Modern UI',
    description: 'Reusable, accessible components built on Tailwind CSS v4 and React 19.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    color: 'bg-rose-100 text-rose-600',
  },
  {
    title: 'Next.js App Router',
    description: 'Built on Next.js 16 with full App Router, server components, and React compiler.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'bg-amber-100 text-amber-600',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Navigation ── */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">Tabloo</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

      {/* Hero Section */}

        {/* ── Hero ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-medium text-indigo-700 mb-8">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            Scalable SaaS starter
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Build your SaaS<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
              on solid foundations
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Full-stack authentication, email verification, protected routes, and a
            reusable component library — ready to extend.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 text-base font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 shadow-sm transition-colors"
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* ── Features grid ── */}
        <section className="bg-slate-50 border-t border-slate-100 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Everything you need to launch
              </h2>
              <p className="mt-3 text-slate-500 max-w-md mx-auto">
                Production-ready auth and infrastructure so you can focus on
                what makes your product unique.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ title, description, icon, color }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4`}>
                    {icon}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Tabloo. All rights reserved.</span>
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <span className="font-medium text-slate-700">Next.js</span>
            <span>·</span>
            <span className="font-medium text-slate-700">Prisma</span>
            <span>·</span>
            <span className="font-medium text-slate-700">PostgreSQL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
