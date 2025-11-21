import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import linkRoutes from "./routes/linkRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/links", linkRoutes);

// MongoDB connection caching for serverless
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB Connected");
}

// Vercel expects an exported handler
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}