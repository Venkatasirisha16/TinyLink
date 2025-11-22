function isValidUrl(userUrl) {
  try {
    const parsed = new URL(userUrl);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }

    if (!parsed.hostname.includes(".")) {
      return false;
    }

    const domainRegex = /^(?!-)(?!.*--)[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;

    if (!domainRegex.test(parsed.hostname)) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

export default isValidUrl;