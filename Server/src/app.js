const express = require("express");
const cors = require("cors");
const app = express();

// TEMP DIAGNOSTIC: require routes and show types
const apiLinks = require("./routes/apiLinks");
const redirect = require("./routes/redirect");

console.log(
  "DEBUG require ./routes/apiLinks ->",
  typeof apiLinks,
  apiLinks && Object.keys(apiLinks || {})
);
console.log(
  "DEBUG require ./routes/redirect ->",
  typeof redirect,
  redirect && Object.keys(redirect || {})
);

// normal middleware
app.use(cors());
app.use(express.json());

// healthz
app.get("/healthz", (req, res) => res.json({ ok: true, version: "1.0" }));

// mount routes (leave these as-is for now)
app.use("/api/links", apiLinks);
app.use("/", redirect);

module.exports = app;
