import * as React from "react"
import { Link, LinkProps, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"
import { LucideIcon } from "lucide-react"

interface NavItemProps extends LinkProps {
  className?: string
  children?: React.ReactNode
  icon?: LucideIcon
  isActive?: boolean
}

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ className, children, icon: Icon, to, isActive, ...props }, ref) => {
    const location = useLocation()
    const active = isActive || location.pathname === to

    return (
      <Link
        to={to}
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