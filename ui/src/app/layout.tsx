import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Providers } from '@/components/providers'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BDC Bridge',
  description: 'BDC Bridge Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen">
            <Header />
            <Sidebar />
            <main className="flex-1 p-6 pt-16 md:ml-64">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
} 