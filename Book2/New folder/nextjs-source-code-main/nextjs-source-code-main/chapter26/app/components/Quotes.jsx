"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingPage from "../loading";
import AddQuote from "./AddQuote";

async function getQuotes() {
  const res = await fetch("http://localhost:3000/api/quotes");
  const json = await res.json();
  return json;
}

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchQuotes = async () => {
    const res = await fetch("/api/quotes");
    const quotes = await res.json();
    setQuotes(quotes);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/quotes/search?query=${query}`);
    const quotes = await res.json();
    setQuotes(quotes);
    setLoading(false);
  };

  const deleteQuote = async (id) => {
    const res = await fetch(`/api/quotes/${id}`, {
      method:'DELETE'
    });
    fetchQuotes();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for Quotes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      <AddQuote refreshQuotes={fetchQuotes} />
      {quotes.map((quote) => (
        <div key={quote.id}>
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <p>{quote.quote}</p>
              <p>- {quote.by}</p>
              <div className="card-actions justify-end">
                <button
                  onClick={() => deleteQuote(quote.id)}
                  className="btn btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Quotes;
