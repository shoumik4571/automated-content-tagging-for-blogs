import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'TALVERIN TagFlow — Automated Content Tagging Studio',
  description:
    'Multi-Label Blog Tagging & Editorial Review Studio powered by Sentence-Transformers (all-MiniLM-L6-v2), TF-IDF + OvR Logistic Regression, and the Talverin UI Stack.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#EFEDE6',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Inter+Tight:wght@500;600&family=Bricolage+Grotesque:wght@600;700&family=JetBrains+Mono:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F4F7F6] text-slate-900 antialiased">
        {children}
        <Toaster
          theme="light"
          richColors
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: '16px',
              border: '1px solid rgba(15,23,42,0.08)',
              boxShadow: '0 12px 32px -8px rgba(15,23,42,0.16)',
            },
          }}
        />
      </body>
    </html>
  )
}
