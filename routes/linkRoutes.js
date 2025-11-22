import express from "express";
import {
  createLink,
  fetchLinks,
  fetchLinkByCode,
  removeLink,
  healthCheck
} from "../Controllers/linkController.js";
import Link from "../models/Link.js";

const router = express.Router();

// Create short link
router.post("/", createLink);

// GET all
router.get("/", fetchLinks);

// GET stats by code
router.get("/:code", fetchLinkByCode);

// Delete by code
router.delete("/:code", removeLink);

// Health check
router.get("/code/healthz", healthCheck);

// Redirect short URL
router.get("/url/:code", async (req, res) => {
  const link = await Link.findOne({ code: req.params.code });

  if (!link) return res.status(404).json({ message: "Short URL not found" });

  link.clicks += 1;
  link.lastClicked = new Date();
  await link.save();

  return res.redirect(link.url);
});

export default router;
