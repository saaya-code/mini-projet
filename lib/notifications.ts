import dbConnect from "@/lib/db"
import Notification from "@/models/Notification"
import User from "@/models/User"

export async function createNotification({
  userId,
  title,
  message,
  link,
}: {
  userId: string
  title: string
  message: string
  link?: string
}) {
  try {
    await dbConnect()

    const notification = await Notification.create({
      user: userId,
      title,
      message,
      link,
      isRead: false,
    })

    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

export async function createNotificationForProfessor({
  professorId,
  title,
  message,
  link,
}: {
  professorId: string
  title: string
  message: string
  link?: string
}) {
  try {
    await dbConnect()

    // Find the user associated with this professor
    const user = await User.findOne({ professorId })

    if (!user) {
      throw new Error("No user found for this professor")
    }

    return createNotification({
      userId: user._id.toString(),
      title,
      message,
      link,
    })
  } catch (error) {
    console.error("Error creating notification for professor:", error)
    throw error
  }
}

export async function createNotificationForStudent({
  studentId,
  title,
  message,
  link,
}: {
  studentId: string
  title: string
  message: string
  link?: string
}) {
  try {
    await dbConnect()

    // Find the user associated with this student
    const user = await User.findOne({ studentId })

    if (!user) {
      throw new Error("No user found for this student")
    }

    return createNotification({
      userId: user._id.toString(),
      title,
      message,
      link,
    })
  } catch (error) {
    console.error("Error creating notification for student:", error)
    throw error
  }
}
