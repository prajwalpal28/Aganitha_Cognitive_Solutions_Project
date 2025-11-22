import React, { useEffect, useState } from "react";
import axios from "axios";
import LinkForm from "../components/LinkForm";
import LinksTable from "../components/LinksTable";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/links");
      setLinks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="container p-4">
      <h1>TinyLink Dashboard</h1>
      <LinkForm onCreate={fetchLinks} />
      <hr />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <LinksTable links={links} onDeleted={fetchLinks} />
      )}
    </div>
  );
}
