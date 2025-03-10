import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import SeedDatabase from "@/scripts/seed-database"

export default function SeedPage() {
  const breadcrumbs = [{ label: "Initialisation", href: "/seed" }]

  return (
    <div>
      <Header breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader
          title="Initialisation de la Base de Données"
          description="Créez des données de test pour le système de planification des soutenances"
        />

        <div className="mt-8">
          <SeedDatabase />
        </div>
      </div>
    </div>
  )
}

