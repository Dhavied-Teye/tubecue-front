import React, { useState } from "react";
import hero from "../../assets/images/herobg.mp4";

const Landing = () => {
  const [link, setLink] = useState("");
  const [keyword, setKeyword] = useState("");
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url) => {
    const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async () => {
    const videoId = extractVideoId(link);
    if (!videoId || !keyword.trim()) {
      setError("Please enter a valid YouTube link and keyword.");
      setMatches([]);
      return;
    }

    setLoading(true);
    setError("");
    setMatches([]);

    try {
      const res = await fetch("https://tubecue-back.onrender.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, keyword }),
      });

      const data = await res.json();

      if (data.matches && data.matches.length > 0) {
        setMatches(
          data.matches.map((m) => ({
            ...m,
            source: data.source || "captions",
          }))
        );
      } else {
        setError("Phrase not found.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLink("");
    setKeyword("");
    setMatches([]);
    setError("");
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
        src={hero}
        autoPlay
        loop
        muted
      ></video>

      <div className="z-20 backdrop-blur-md bg-white/10 rounded-xl p-8 max-w-2xl w-full text-center text-white pointer-events-auto">
        <h1 className="text-4xl font-bold mb-4">Jump to what matters</h1>
        <p className="text-sm text-gray-300 mb-6">
          Paste a YouTube video link and enter a keyword to begin.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="text"
            placeholder="YouTube video link"
            className="w-full sm:w-96 px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <input
            type="text"
            placeholder="Keyword"
            className="w-full sm:w-64 px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 inline"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                  ></path>
                </svg>
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        {matches.length > 0 && (
          <div className="mt-6 text-left">
            <h2 className="text-lg font-semibold text-white mb-2">
              Matches found:
            </h2>
            <ul className="space-y-1 text-sm">
              {matches.map((m, index) => (
                <li key={index}>
                  <a
                    href={`${link}&t=${m.start}s`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-300"
                  >
                    [{m.start}s] {m.text}
                  </a>
                  <span className="ml-2 text-gray-300 text-xs">
                    (
                    {m.source === "whisper"
                      ? "via Whisper AI"
                      : "YouTube captions"}
                    )
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(matches.length > 0 || error) && (
          <button
            className="mt-6 text-sm underline text-gray-300 hover:text-white"
            onClick={handleReset}
          >
            Reset search
          </button>
        )}
      </div>
    </div>
  );
};

export default Landing;
