import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Defense from "@/models/Defense"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    await dbConnect()

    let query = {}

    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      query = {
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }
    }

    const defenses = await Defense.find(query)
      .populate({
        path: "project",
        populate: [{ path: "student" }, { path: "supervisor" }],
      })
      .populate("room")
      .populate("juryPresident")
      .populate("juryReporter")
      .sort({ date: 1, startTime: 1 })

    return NextResponse.json(defenses)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch defenses" }, { status: 500 })
  }
}
