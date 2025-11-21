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

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`Server running on ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
