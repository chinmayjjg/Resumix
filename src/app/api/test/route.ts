import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ status: "connected" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "connection failed" }, { status: 500 });
  }
}
