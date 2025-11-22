import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CodeStats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/links/${code}`)
      .then((res) => setLink(res.data))
      .catch(() => setLink(null));
  }, [code]);

  if (!link) return <div>Not found</div>;

  return (
    <div className="container p-4">
      <h2>Stats for {link.code}</h2>
      <p>
        Target: <a href={link.url}>{link.url}</a>
      </p>
      <p>Clicks: {link.clicks}</p>
      <p>
        Last Clicked:{" "}
        {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "-"}
      </p>
      <p>Created: {new Date(link.createdAt).toLocaleString()}</p>
    </div>
  );
}
