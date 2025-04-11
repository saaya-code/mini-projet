import mongoose, { Schema, type Document } from "mongoose"
import type { IProject } from "./Project"
import type { IProfessor } from "./Professor"
import type { IRoom } from "./Room"

export interface IDefense extends Document {
  project: mongoose.Types.ObjectId | IProject
  date: Date
  startTime: string
  endTime: string
  room: mongoose.Types.ObjectId | IRoom
  juryPresident: mongoose.Types.ObjectId | IProfessor
  juryReporter: mongoose.Types.ObjectId | IProfessor
}

const DefenseSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    juryPresident: { type: Schema.Types.ObjectId, ref: "Professor", required: true },
    juryReporter: { type: Schema.Types.ObjectId, ref: "Professor", required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Defense || mongoose.model<IDefense>("Defense", DefenseSchema)
