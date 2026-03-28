import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import TopProgressBar from "@/components/ui/TopProgressBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.APP_URL ?? 'http://localhost:3000'),
  title: { template: '%s — Tabloo', default: 'Tabloo — Modern SaaS Platform' },
  description: 'Secure authentication with email verification and protected routes.',
  robots: { index: false, follow: false },
};

/**
 * RootLayout — app shell.
 *
 * suppressHydrationWarning on <html> prevents React from flagging the 'dark'
 * class mismatch caused by the anti-FOUC inline script running before hydration.
 */
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Anti-FOUC: sets .dark on <html> synchronously before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        <ThemeProvider>
          <TopProgressBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
