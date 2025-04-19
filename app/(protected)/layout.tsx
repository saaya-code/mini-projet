import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PageTransition } from "@/components/page-transition"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:pl-64">
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
