import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>TinyLink - Client</h1>
      <p>
        Dashboard will be here. Visit <Link to="/code/test">/code/test</Link>
      </p>
    </div>
  );
}

function CodeTest() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Code stats placeholder</h2>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/code/:code" element={<CodeTest />} />
      </Routes>
    </BrowserRouter>
  );
}
