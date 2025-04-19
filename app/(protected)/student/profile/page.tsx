import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import { StudentProfileView } from "@/components/student-profile-view"

export default async function StudentProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "student") {
    redirect("/login")
  }

  const breadcrumbs = [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Mon profil", href: "/student/profile" },
  ]

  return (
    <div>
      <Header title="Mon profil" breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title="Mon profil" description="Consultez vos informations personnelles" />
        <StudentProfileView userId={session.user.id} />
      </div>
    </div>
  )
}
