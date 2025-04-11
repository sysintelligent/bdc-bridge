'use client'

import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export function App({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Header />
      <Sidebar />
      <main className="flex-1 p-6 pt-16 md:ml-64">
        {children}
      </main>
    </div>
  )
} 