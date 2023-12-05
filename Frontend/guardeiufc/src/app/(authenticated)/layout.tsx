import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from "@/components/Header/page"
const inter = Inter({ subsets: ['latin'] })
import "bootstrap/dist/css/bootstrap.min.css";

export const metadata: Metadata = {
  title: 'GuardeiUFC',
  description: 'Página inicial do site de administração de patrimônios',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header></Header>
        {children}
      </body>
    </html>
  )
}
