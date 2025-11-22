import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./Config/db.js";
import linkRoutes from "./routes/linkRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/links", linkRoutes);

// Vercel handler
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
