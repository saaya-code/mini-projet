import { MobileNav } from "./mobile-nav"
import { Breadcrumbs } from "./breadcrumbs"
import { UserMenu } from "./user-menu"
import { NotificationBell } from "./notification-bell"

interface HeaderProps {
  title: string
  breadcrumbs?: {
    label: string
    href: string
  }[]
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MobileNav />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex-1 animate-fade-in">{breadcrumbs && <Breadcrumbs items={breadcrumbs} />}</div>
          <div className="flex items-center gap-2 animate-fade-in">
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
