import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AuthProvider from "@/components/AuthProvider"

export const metadata: Metadata = {
  title: "ClozOptimizer — Premium PC Performance Suite",
  description: "The ultimate Windows optimization, gaming performance, and system intelligence platform. Download free.",
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
