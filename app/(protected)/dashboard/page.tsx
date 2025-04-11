import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/dashboard/admin-dashboard"
import ProfessorDashboard from "@/components/dashboard/professor-dashboard"
import StudentDashboard from "@/components/dashboard/student-dashboard"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const breadcrumbs = [{ label: "Tableau de bord", href: "/dashboard" }]

  return (
    <div>
      <Header  breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title={`Bienvenue, ${session?.user?.name}`} description="Votre tableau de bord personnalisé" />

        {session?.user?.role === "admin" && <AdminDashboard />}
        {session?.user?.role === "professor" && <ProfessorDashboard userId={session?.user?.id} />}
        {session?.user?.role === "student" && <StudentDashboard userId={session?.user?.id} />}
      </div>
    </div>
  )
}
