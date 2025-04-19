import mongoose, { Schema, type Document } from "mongoose"

export interface INotification extends Document {
  user: mongoose.Types.ObjectId
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: Date
}

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)
