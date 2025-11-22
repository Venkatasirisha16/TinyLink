import express from "express";
import Link from "../models/Link.js";

const router = express.Router();

router.get("/:code", async (req, res) => {
  const link = await Link.findOne({ code: req.params.code });

  if (!link) return res.status(404).json({ message: "Short URL not found" });

  link.clicks += 1;
  link.lastClicked = new Date();
  await link.save();

  return res.redirect(link.url);
});

export default router;