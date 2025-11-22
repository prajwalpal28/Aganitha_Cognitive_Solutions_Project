const express = require("express");
const router = express.Router();
const path = require("path");

// require using __dirname to avoid relative path mistakes
const Link = require(path.join(__dirname, "..", "models", "Link"));

// GET /:code redirect
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findById(code);
    if (!link) return res.status(404).send("Not Found");

    // increment clicks + update lastClicked
    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    return res.redirect(302, link.url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
