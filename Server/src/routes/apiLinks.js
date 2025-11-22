// server/src/routes/apiLinks.js
const express = require("express");
const router = express.Router();
const path = require("path");
const Link = require(path.join(__dirname, "..", "models", "Link"));
const isValidUrl = require("../utils/validateUrl");
const { customAlphabet } = require("nanoid");
// 62-char alphabet (0-9, a-z, A-Z) and length 6

const nano = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6
);

// const shortid = require("shortid");

// shortid.characters(
//   "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
// );

// POST /api/links
router.post("/", async (req, res) => {
  try {
    let { url, code } = req.body;
    if (!url) return res.status(400).json({ error: "url is required" });

    if (!/^https?:\/\//i.test(url)) url = "http://" + url;
    if (!isValidUrl(url)) return res.status(400).json({ error: "invalid url" });

    if (code) {
      if (!/^[A-Za-z0-9]{6,8}$/.test(code))
        return res
          .status(400)
          .json({ error: "code must follow [A-Za-z0-9]{6,8}" });

      const exists = await Link.findById(code);
      if (exists) return res.status(409).json({ error: "code already exists" });

      const link = new Link({ code, url });
      await link.save();
      return res
        .status(201)
        .json({ code: link.code, url: link.url, clicks: link.clicks });
    } else {
      let newCode;
      do {
        newCode = nano();
      } while (await Link.findById(newCode));

      const link = new Link({ code: newCode, url });
      await link.save();
      return res
        .status(201)
        .json({ code: link.code, url: link.url, clicks: link.clicks });
    }
  } catch (err) {
    console.error("createLink error", err);
    return res.status(500).json({ error: "server error" });
  }
});

// GET /api/links
router.get("/", async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    return res.json(
      links.map((l) => ({
        code: l.code,
        url: l.url,
        clicks: l.clicks,
        lastClicked: l.lastClicked,
        createdAt: l.createdAt,
      }))
    );
  } catch (err) {
    console.error("listLinks error", err);
    return res.status(500).json({ error: "server error" });
  }
});

// GET /api/links/:code
router.get("/:code", async (req, res) => {
  try {
    const link = await Link.findById(req.params.code);
    if (!link) return res.status(404).json({ error: "Not found" });
    return res.json({
      code: link.code,
      url: link.url,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt,
    });
  } catch (err) {
    console.error("getLink error", err);
    return res.status(500).json({ error: "server error" });
  }
});

// DELETE /api/links/:code
router.delete("/:code", async (req, res) => {
  try {
    const link = await Link.findByIdAndDelete(req.params.code);
    if (!link) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteLink error", err);
    return res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
