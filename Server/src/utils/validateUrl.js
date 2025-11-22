const validator = require("validator");

function isValidUrl(url) {
  if (!url) return false;
  // Make sure it has protocol; if not, add http for validation then strip later
  return validator.isURL(url, { require_protocol: true });
}

module.exports = isValidUrl;
