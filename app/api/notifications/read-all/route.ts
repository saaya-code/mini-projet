import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Notification from "@/models/Notification"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Mark all notifications as read for the current user
    await Notification.updateMany({ user: session.user.id, isRead: false }, { $set: { isRead: true } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}
