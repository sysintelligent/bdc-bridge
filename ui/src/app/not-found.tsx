'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl">Page not found</p>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link href="/">
        <Button>Go back home</Button>
      </Link>
    </div>
  )
} 