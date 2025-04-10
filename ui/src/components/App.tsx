'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'
import Dashboard from '@/pages/Dashboard'
import Applications from '@/pages/Applications'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'

export function App() {
  const pathname = usePathname()

  const renderContent = () => {
    switch (pathname) {
      case '/':
        return <Dashboard />
      case '/applications':
        return <Applications />
      case '/settings':
        return <Settings />
      default:
        return <NotFound />
    }
  }

  return (
    <div className="relative min-h-screen">
      <Header />
      <Sidebar />
      <main className="flex-1 p-6 pt-16 md:ml-64">
        {renderContent()}
      </main>
    </div>
  )
} 