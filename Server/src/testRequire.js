const path = require("path");
console.log(
  "trying to require Link.js at:",
  path.join(__dirname, "models", "Link.js")
);
try {
  const Link = require(path.join(__dirname, "models", "Link.js"));
  console.log("require succeeded:", typeof Link);
} catch (e) {
  console.error("require failed:", e.stack || e.message);
}
