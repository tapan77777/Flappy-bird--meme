import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "StayLocal — Slow Travel, Real Places",
    template: "%s | StayLocal",
  },
  description:
    "StayLocal hosts small, slow, culture-first journeys focused on nature, local life, and meaningful travel — not tourism.",
  applicationName: "StayLocal",
  keywords: [
    "slow travel",
    "local travel",
    "small group journeys",
    "Himachal travel",
    "Jibhi Shoja",
    "StayLocal",
  ],
  authors: [{ name: "StayLocal" }],
  creator: "StayLocal",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "StayLocal — Slow Travel, Real Places",
    description:
      "Travel slowly. Stay local. Experience nature and culture with small, intentional journeys.",
    url: "https://staylocal.vercel.app",
    siteName: "StayLocal",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StayLocal — Slow Travel, Real Places",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "StayLocal — Slow Travel, Real Places",
    description:
      "Small group, culture-first journeys for travelers who value depth over distance.",
    images: ["/og-image.jpg"],
  },

  themeColor: "#0f766e", // emerald-700
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DX345RB9S0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DX345RB9S0');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        {children}
      </body>
    </html>
  )
}
