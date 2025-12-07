import { useState } from "react";
import API from "./api";
import ComparisonView from "./components/ComparisonView";
import HistoryTable from "./components/HistoryTable";

export default function App() {
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const handleOptimize = async () => {
    if (!asin) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data } = await API.post("/optimize", { asin });
      setResult(data);
      fetchHistory();
    } catch (err) {
      console.error(err);
      setError("Failed to optimize. Invalid ASIN or server error.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await API.get(`/history/${asin}`);
      setHistory(data.history || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1>Amazon Listing Optimizer</h1>
      <p className="subtitle">AI-powered enhancement for Amazon product pages</p>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter ASIN (e.g. B07H65KP63)"
          value={asin}
          onChange={(e) => setAsin(e.target.value)}
        />

        <button onClick={handleOptimize}>
          {loading ? "Optimizing..." : "Optimize"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Comparison Section */}
      {result && <ComparisonView original={result.original} optimized={result.optimized} />}

      {/* History */}
      {history.length > 0 && (
        <HistoryTable history={history} onSelect={(row) => setResult(row)} />
      )}
    </div>
  );
}
