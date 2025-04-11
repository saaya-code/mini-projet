import mongoose, { Schema, type Document } from "mongoose"

export interface TimeSlot {
  day: string
  startTime: string
  endTime: string
}

export interface IProfessor extends Document {
  name: string
  email: string
  department: string
  availability: TimeSlot[]
}

const TimeSlotSchema = new Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
})

const ProfessorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    availability: [TimeSlotSchema],
  },
  { timestamps: true },
)

export default mongoose.models.Professor || mongoose.model<IProfessor>("Professor", ProfessorSchema)
