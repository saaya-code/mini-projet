import Link from "next/link"
import { GraduationCap } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-university-700 text-white overflow-hidden group-hover:shadow-lg transition-all duration-300">
        <GraduationCap className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight text-university-800 dark:text-university-300 group-hover:text-university-600 dark:group-hover:text-university-200 transition-colors duration-300">
          UniDefense
        </span>
        <span className="text-xs text-muted-foreground leading-tight group-hover:text-university-500 transition-colors duration-300">
          Système de Planification
        </span>
      </div>
    </Link>
  )
}
