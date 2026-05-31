import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AuthProvider from "@/components/AuthProvider"

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cloz-optimizer.up.railway.app"
const DESC = "The ultimate Windows optimization, gaming performance, and system intelligence platform. 45+ tools, AI tuning, and a community marketplace. Download free."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ClozOptimizer — Premium PC Performance Suite",
    template: "%s · ClozOptimizer",
  },
  description: DESC,
  applicationName: "ClozOptimizer",
  keywords: ["PC optimization", "Windows tweaks", "gaming performance", "FPS boost", "system cleanup", "ClozOptimizer"],
  authors: [{ name: "Cloz" }],
  openGraph: {
    type: "website",
    siteName: "ClozOptimizer",
    title: "ClozOptimizer — Premium PC Performance Suite",
    description: DESC,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "ClozOptimizer — Premium PC Performance Suite",
    description: DESC,
  },
  icons: { icon: "/media/cloz-icon.svg" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark antialiased">
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <AuthProvider>
          <Navbar />
          <main className="pt-16 flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
