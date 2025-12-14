import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in .env");


declare global {
  // eslint-disable-next-line no-var
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var mongoose: { conn: any; promise: any } | undefined;
}

const cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
