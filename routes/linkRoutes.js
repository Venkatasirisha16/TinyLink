import express from "express";
import axios from "axios";
import Link from "../models/Link.js";

const router = express.Router();


// ----------------------------
// CREATE NEW SHORT LINK
// POST /api/links
// ----------------------------
// Utility to generate random code
function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

router.post("/", async (req, res) => {
  try {
    const { url, code } = req.body;

    // Validation: URL is mandatory
    if (!url) {
      return res.status(400).json({ message: "url is required" });
    }

    let finalCode = code;

    // If code is provided, validate its pattern
    if (finalCode) {
      if (!/^[A-Za-z0-9]{6,8}$/.test(finalCode)) {
        return res.status(400).json({
          message: "Code must match pattern [A-Za-z0-9]{6,8}",
        });
      }
    } else {
      // Auto-generate code (ensure unique)
      do {
        const length = Math.floor(Math.random() * 3) + 6; // generate 6,7 or 8
        finalCode = generateCode(length);
      } while (await Link.findOne({ code: finalCode })); // avoid collisions
    }

    // Check duplicate only if user provided code
    if (code) {
      const exists = await Link.findOne({ code: finalCode });
      if (exists) {
        return res.status(409).json({ message: "Code already exists" });
      }
    }

    // Create document
    const newLink = await Link.create({
      url,
      code: finalCode,
    });

    res.status(201).json(newLink);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ----------------------------
// GET ALL LINKS
// GET /api/links
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const links = await Link.find().sort({ _id: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ----------------------------
// GET LINK STATS BY CODE
// GET /api/links/:code
// ----------------------------
router.get("/:code", async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });

    if (!link) return res.status(404).json({ message: "Code not found" });

    res.json(link);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ----------------------------
// DELETE LINK BY CODE
// DELETE /api/links/:code
// ----------------------------
router.delete("/:code", async (req, res) => {
  try {
    const deleted = await Link.findOneAndDelete({ code: req.params.code });

    if (!deleted)
      return res.status(404).json({ message: "Code not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ----------------------------
// URL HEALTH CHECK
// GET /api/links/code/healthz?url=...
// ----------------------------
router.get("/code/healthz", async (req, res) => {
  try {
    const targetURL = req.query.url;
    if (!targetURL)
      return res.status(400).json({ message: "url query param required" });

    try {
      const check = await axios.get(targetURL, { timeout: 5000 });
      return res.status(200).json({
        status: check.status,
        message: "URL reachable",
      });
    } catch (err) {
      return res.status(400).json({
        message: "URL unreachable",
        error: err.message,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ----------------------------
// REDIRECT SHORT URL
// GET /:code
// ----------------------------
router.get("/url/:code", async (req, res) => {
  try {
    const code = req.params.code;

    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Update analytics
    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    // Redirect to the original URL
    return res.redirect(link.url);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
