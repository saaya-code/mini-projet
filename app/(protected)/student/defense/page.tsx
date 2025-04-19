import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import { StudentDefenseView } from "@/components/student-defense-view"

export default async function StudentDefensePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "student") {
    redirect("/login")
  }

  const breadcrumbs = [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Ma soutenance", href: "/student/defense" },
  ]

  return (
    <div>
      <Header title="Ma soutenance" breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title="Ma soutenance de fin d'études" description="Consultez les détails de votre soutenance" />
        <StudentDefenseView userId={session.user.id} />
      </div>
    </div>
  )
}
