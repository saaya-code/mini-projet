import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import { ProfessorDefensesList } from "@/components/professor-defenses-list"

export default async function ProfessorDefensesPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "professor") {
    redirect("/login")
  }

  const breadcrumbs = [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Mes soutenances", href: "/professor/defenses" },
  ]

  return (
    <div>
      <Header title="Mes soutenances" breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title="Mes soutenances" description="Consultez les soutenances où vous êtes impliqué" />
        <ProfessorDefensesList userId={session.user.id} />
      </div>
    </div>
  )
}
