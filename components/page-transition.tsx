import type { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  // Simple wrapper with no animations
  return <div>{children}</div>
}
