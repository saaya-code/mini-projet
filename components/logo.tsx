import Link from "next/link"
import { CalendarCheck } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
        <CalendarCheck className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight">DefensePlan</span>
        <span className="text-xs text-muted-foreground leading-tight">Système de Planification</span>
      </div>
    </Link>
  )
}
