import { MobileNav } from "./mobile-nav"
import { Breadcrumbs } from "./breadcrumbs"

interface HeaderProps {
  breadcrumbs?: {
    label: string
    href: string
  }[]
}

export function Header({ breadcrumbs }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MobileNav />
        <div className="flex flex-1 items-center justify-between md:justify-end">
          <div className="flex-1">
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          </div>
        </div>
      </div>
    </header>
  )
}
