import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Grain from "@/components/Grain"
import SmoothScroll from "@/components/SmoothScroll"
import { getLocale } from "@/lib/locale"
import {
  siteUrl,
  siteName,
  siteMeta,
  ogImagePath,
  ogImageWidth,
  ogImageHeight,
} from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const meta = siteMeta[locale]
  const ogLocale = locale === "fr" ? "fr_FR" : "en_US"

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: meta.title,
      template: `%s · ${siteName}`,
    },
    description: meta.description,
    applicationName: siteName,
    keywords: [
      "mariage",
      "wedding",
      siteName,
      "RSVP",
      "Manoir de Villefermoy",
    ],
    authors: [{ name: siteName }],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: siteUrl,
      siteName,
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: ogImagePath,
          width: ogImageWidth,
          height: ogImageHeight,
          alt: meta.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImagePath],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <SmoothScroll />
        <ThemeProvider>{children}</ThemeProvider>
        <Grain />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
