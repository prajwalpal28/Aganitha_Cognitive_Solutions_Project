import React from "react";
import axios from "axios";

export default function LinksTable({ links, onDeleted }) {
  const deleteLink = async (code) => {
    if (!window.confirm("Delete link?")) return;
    try {
      await axios.delete(`/api/links/${code}`);
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Short</th>
          <th>Target</th>
          <th>Clicks</th>
          <th>Last Clicked</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {links.length === 0 && (
          <tr>
            <td colSpan="5">No links</td>
          </tr>
        )}
        {links.map((l) => (
          <tr key={l.code}>
            <td>
              <a href={`/${l.code}`} target="_blank" rel="noreferrer">
                {l.code}
              </a>
            </td>
            <td
              style={{
                maxWidth: 400,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {l.url}
            </td>
            <td>{l.clicks}</td>
            <td>
              {l.lastClicked ? new Date(l.lastClicked).toLocaleString() : "-"}
            </td>
            <td>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    window.location.origin + "/" + l.code
                  )
                }
              >
                Copy
              </button>
              <button onClick={() => deleteLink(l.code)}>Delete</button>
              <a href={`/code/${l.code}`}>Stats</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
