import mongoose from "mongoose"
import { preloadModels } from "./models"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/defense-planning"

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // Preload all models to ensure they're registered
      preloadModels()
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
