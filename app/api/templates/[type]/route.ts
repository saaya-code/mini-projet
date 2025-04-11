import { NextResponse } from "next/server"
import { utils, write } from "xlsx"

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  try {
    const resolvedParams = await params;
    const type = resolvedParams.type

    // Create a new workbook
    const wb = utils.book_new()
    let ws

    // Create worksheet based on the type
    switch (type) {
      case "professors":
        ws = utils.json_to_sheet([
          {
            name: "Jean Dupont",
            email: "jean.dupont@universite.fr",
            department: "Informatique",
          },
          {
            name: "Marie Martin",
            email: "marie.martin@universite.fr",
            department: "Mathématiques",
          },
        ])
        break

      case "students":
        ws = utils.json_to_sheet([
          {
            name: "Pierre Durand",
            email: "pierre.durand@etudiant.fr",
            studentId: "20210001",
            program: "Master Informatique",
          },
          {
            name: "Sophie Lefebvre",
            email: "sophie.lefebvre@etudiant.fr",
            studentId: "20210002",
            program: "Master Informatique",
          },
        ])
        break

      case "projects":
        ws = utils.json_to_sheet([
          {
            title: "Développement d'une application web",
            description: "Création d'une application web avec React et Node.js",
            studentEmail: "pierre.durand@etudiant.fr",
            supervisorEmail: "jean.dupont@universite.fr",
          },
          {
            title: "Analyse de données massives",
            description: "Utilisation de techniques d'apprentissage automatique pour l'analyse de données",
            studentEmail: "sophie.lefebvre@etudiant.fr",
            supervisorEmail: "marie.martin@universite.fr",
          },
        ])
        break

      case "rooms":
        ws = utils.json_to_sheet([
          {
            name: "A101",
            capacity: 30,
            building: "Bâtiment A",
            floor: 1,
            isAvailable: true,
          },
          {
            name: "B205",
            capacity: 25,
            building: "Bâtiment B",
            floor: 2,
            isAvailable: true,
          },
        ])
        break

      default:
        return NextResponse.json({ error: "Invalid template type" }, { status: 400 })
    }

    // Add the worksheet to the workbook
    utils.book_append_sheet(wb, ws, "Template")

    // Generate buffer
    const buf = write(wb, { type: "buffer", bookType: "xlsx" })

    // Set headers for file download
    const headers = new Headers()
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    headers.set("Content-Disposition", `attachment; filename=${type}_template.xlsx`)

    return new NextResponse(buf, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate template" }, { status: 500 })
  }
}
