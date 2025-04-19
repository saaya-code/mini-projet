import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import { ProfessorAvailabilityForm } from "@/components/professor-availability-form"

export default async function ProfessorAvailabilityPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "professor") {
    redirect("/login")
  }

  const breadcrumbs = [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Mes disponibilités", href: "/professor/availability" },
  ]

  return (
    <div>
      <Header title="Mes disponibilités" breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title="Mes disponibilités" description="Gérez vos créneaux de disponibilité pour les soutenances" />
        <ProfessorAvailabilityForm userId={session.user.id} />
      </div>
    </div>
  )
}
