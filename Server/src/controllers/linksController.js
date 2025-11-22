const Link = require("../models/Link");
const isValidUrl = require("../utils/validateUrl");
const shortid = require("shortid");

shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
);

exports.createLink = async (req, res) => {
  try {
    let { url, code } = req.body;
    if (!url) return res.status(400).json({ error: "url is required" });

    // Ensure protocol (user may submit without)
    if (!/^https?:\/\//i.test(url)) url = "http://" + url;

    if (!isValidUrl(url)) return res.status(400).json({ error: "invalid url" });

    if (code) {
      // enforce pattern
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
      // generate code until unique
      let newCode;
      do {
        newCode = shortid.generate().slice(0, 6); // produce 6 chars; ensure alphanumeric
      } while (await Link.findById(newCode));

      const link = new Link({ code: newCode, url });
      await link.save();
      return res
        .status(201)
        .json({ code: link.code, url: link.url, clicks: link.clicks });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
};

exports.listLinks = async (req, res) => {
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
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
};

exports.getLink = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findById(code);
    if (!link) return res.status(404).json({ error: "Not found" });
    return res.json({
      code: link.code,
      url: link.url,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findByIdAndDelete(code);
    if (!link) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
};
