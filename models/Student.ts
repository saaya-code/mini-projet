import mongoose, { Schema, type Document } from "mongoose"

export interface IStudent extends Document {
  name: string
  email: string
  studentId: string
  program: string
}

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, unique: true },
    program: { type: String, required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema)

