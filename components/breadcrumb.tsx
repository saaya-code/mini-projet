import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  title: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-6">
      <Link href="/" className="flex items-center hover:text-primary transition-colors">
        <Home className="h-4 w-4 mr-1" />
        Accueil
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-2" />
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.title}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.title}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
