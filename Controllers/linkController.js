import {
  createShortLink,
  getAllLinks,
  getLinkByCode,
  deleteLink,
} from "../Services/linkService.js";

import { checkURLHealth } from "../Utils/healthCheck.js";

export async function createLink(req, res) {
  try {
    const { url, code } = req.body;

    if (!url) return res.status(400).json({ message: "url is required" });

    const link = await createShortLink(url, code);
    res.status(201).json(link);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function fetchLinks(req, res) {
  try {
    res.json(await getAllLinks());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function fetchLinkByCode(req, res) {
  try {
    const link = await getLinkByCode(req.params.code);

    if (!link) return res.status(404).json({ message: "Code not found" });

    res.json(link);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function removeLink(req, res) {
  try {
    const deleted = await deleteLink(req.params.code);

    if (!deleted) return res.status(404).json({ message: "Code not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function healthCheck(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).json({ message: "url query param required" });

  const result = await checkURLHealth(url);

  if (result.ok) {
    return res.json({ status: result.status, message: "URL reachable" });
  }

  return res.status(400).json({ message: "URL unreachable", error: result.error });
}
