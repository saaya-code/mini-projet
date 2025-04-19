import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import { StudentProjectView } from "@/components/student-project-view"

export default async function StudentProjectPage() {
  const session = await getServerSession(authOptions)

  if (!session || session?.user?.role !== "student") {
    redirect("/login")
  }

  const breadcrumbs = [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Mon projet", href: "/student/project" },
  ]

  return (
    <div>
      <Header title="Mon projet" breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title="Mon projet de fin d'études" description="Consultez les détails de votre projet" />
        <StudentProjectView userId={session.user.id} />
      </div>
    </div>
  )
}
