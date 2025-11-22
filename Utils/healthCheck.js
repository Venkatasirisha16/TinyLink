import axios from "axios";

export async function checkURLHealth(url) {
  try {
    const res = await axios.get(url, { timeout: 5000 });
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
