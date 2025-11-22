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


export default router;
