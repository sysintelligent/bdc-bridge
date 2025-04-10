'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"
import { LucideIcon } from "lucide-react"

interface NavItemProps {
  className?: string
  children?: React.ReactNode
  icon?: LucideIcon
  isActive?: boolean
  href: string
}

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ className, children, icon: Icon, href, isActive, ...props }, ref) => {
    const pathname = usePathname()
    const active = isActive || pathname === href

    return (
      <Link
        href={href}
        ref={ref}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start gap-2 rounded-none py-2 px-4 font-normal",
          active && "bg-accent text-accent-foreground",
          className
        )}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </Link>
    )
  }
)
NavItem.displayName = "NavItem"

export { NavItem, type NavItemProps } 