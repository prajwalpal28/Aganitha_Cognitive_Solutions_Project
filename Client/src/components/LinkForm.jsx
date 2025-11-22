import React, { useState } from "react";
import axios from "axios";

export default function LinkForm({ onCreate }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await axios.post("/api/links", {
        url,
        code: code || undefined,
      });
      setMsg({ type: "success", text: `Created: ${res.data.code}` });
      setUrl("");
      setCode("");
      if (onCreate) onCreate();
    } catch (err) {
      if (err.response)
        setMsg({ type: "error", text: err.response.data.error || "Error" });
      else setMsg({ type: "error", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div>
        <label>Target URL</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/long-url"
          required
        />
      </div>
      <div>
        <label>Custom Code (optional, 6-8 alnum)</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="abc123"
        />
      </div>
      <button disabled={loading}>{loading ? "Creating..." : "Create"}</button>
      {msg && (
        <div style={{ color: msg.type === "error" ? "red" : "green" }}>
          {msg.text}
        </div>
      )}
    </form>
  );
}
