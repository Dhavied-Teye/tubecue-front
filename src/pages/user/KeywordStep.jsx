import React, { useState } from "react";
import { useParams } from "react-router";

const KeywordStep = () => {
  const { videoId } = useParams();
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:4000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId, keyword }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Something went wrong." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Search a phrase</h1>
      <p className="text-gray-500">
        In video: <code>{videoId}</code>
      </p>

      <input
        type="text"
        placeholder="Type a keyword or phrase..."
        className="w-full max-w-md px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Searching..." : "Find"}
      </button>

      {result && (
        <div className="mt-4">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : result.timestamp !== null ? (
            <a
              className="text-blue-600 underline"
              href={`https://www.youtube.com/watch?v=${videoId}&t=${result.timestamp}s`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Jump to{" "}
              {new Date(result.timestamp * 1000).toISOString().substr(11, 8)}
            </a>
          ) : (
            <p className="text-gray-600">Phrase not found in the transcript.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default KeywordStep;
