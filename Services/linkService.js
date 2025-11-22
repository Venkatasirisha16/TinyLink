import Link from "../models/Link.js";
import { generateCode } from "../Utils/generateCode.js";

export async function createShortLink(url, customCode) {
  let finalCode = customCode;

  if (finalCode) {
    if (!/^[A-Za-z0-9]{6,8}$/.test(finalCode)) {
      throw new Error("Code must be 6–8 characters and contain only letters or numbers.");
    }

    const exists = await Link.findOne({ code: finalCode });
    if (exists) throw new Error("Code already exists");
  } else {
    do {
      const len = Math.floor(Math.random() * 3) + 6;
      finalCode = generateCode(len);
    } while (await Link.findOne({ code: finalCode }));
  }

  const newLink = await Link.create({ url, code: finalCode });
  return newLink;
}

export async function getAllLinks() {
  return Link.find().sort({ _id: -1 });
}

export async function getLinkByCode(code) {
  return Link.findOne({ code });
}

export async function deleteLink(code) {
  return Link.findOneAndDelete({ code });
}
