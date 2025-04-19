import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Notification from "@/models/Notification"

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const id = params.id

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Find notification and ensure it belongs to the current user
    const notification = await Notification.findOne({
      _id: id,
      user: session.user.id,
    })

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    // Mark as read
    notification.isRead = true
    await notification.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}
