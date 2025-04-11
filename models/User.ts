import mongoose, { Schema, type Document } from "mongoose"
import { hash } from "bcrypt"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "admin" | "professor" | "student"
  image?: string
  professorId?: mongoose.Types.ObjectId
  studentId?: mongoose.Types.ObjectId
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: ["admin", "professor", "student"] },
    image: { type: String },
    professorId: { type: Schema.Types.ObjectId, ref: "Professor" },
    studentId: { type: Schema.Types.ObjectId, ref: "Student" },
  },
  { timestamps: true },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    const hashedPassword = await hash(this.password, 10)
    this.password = hashedPassword
    next()
  } catch (error) {
    next(error as Error)
  }
})

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
