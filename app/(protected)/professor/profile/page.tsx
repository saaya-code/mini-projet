import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import { ProfessorProfileForm } from "@/components/professor-profile-form"

export default async function ProfessorProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "professor") {
    redirect("/login")
  }

  const breadcrumbs = [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Mon profil", href: "/professor/profile" },
  ]

  return (
    <div>
      <Header title="Mon profil" breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title="Mon profil" description="Gérez vos informations personnelles" />
        <ProfessorProfileForm userId={session.user.id} />
      </div>
    </div>
  )
}
