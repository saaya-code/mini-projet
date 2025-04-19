import mongoose, { Schema, type Document } from "mongoose"
import type { IStudent } from "./Student"
import type { IProfessor } from "./Professor"

export interface IProject extends Document {
  title: string
  description: string
  student: mongoose.Types.ObjectId | IStudent
  supervisor: mongoose.Types.ObjectId | IProfessor
}

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    supervisor: { type: Schema.Types.ObjectId, ref: "Professor", required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
