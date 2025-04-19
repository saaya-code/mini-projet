import mongoose, { Schema, type Document } from "mongoose"

export interface IRoom extends Document {
  name: string
  capacity: number
  building: string
  floor: number
  isAvailable: boolean
}

const RoomSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    building: { type: String, required: true },
    floor: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema)
