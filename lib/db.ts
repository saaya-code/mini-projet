import mongoose from "mongoose";

const uri = process.env.MONGODB_URI ?? "";
console.log(uri)

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

//cc c'est bouali on utilise ici le singleton pattern hh merci
let isConnected = false;

export async function dbConnect() {
  if (isConnected) return;

  const db = await mongoose.connect(uri);
  isConnected = !!db.connections[0].readyState;
  console.log("MongoDB connected");
}