import React, { useState } from "react";

function FileUpload({ onData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5170/api/Budget/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Upload failed');
      }

      // RESPONSE IS AN ARRAY; pass that to Dashboard
      const data = await response.json();
      if (onData) onData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <input
        type="file"
        onChange={handleUpload}
        disabled={loading}
        accept=".csv,.txt"
      />
      {loading && <div>Uploading...</div>}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export default FileUpload;