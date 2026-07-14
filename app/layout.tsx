import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Grain from "@/components/Grain"

export const metadata: Metadata = {
  title: "Junias & Caroline",
  description: "Mariage de Junias & Caroline",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Grain />
        <Analytics />
      </body>
    </html>
  )
}
