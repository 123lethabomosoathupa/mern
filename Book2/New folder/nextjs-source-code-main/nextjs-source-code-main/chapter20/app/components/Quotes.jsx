"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingPage from "../loading";

async function getQuotes() {
  const res = await fetch("http://localhost:3000/api/quotes");
  const json = await res.json();
  return json;
}

const Quotes = async () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuotes()
    .then((quotes) => {
      setQuotes(quotes);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingPage />
  }

  return (
    <div>
      {quotes.map((quote) => (
        <div key={quote.id}>
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <p>{quote.quote}</p>
            <p>- {quote.by}</p>
            <div className="card-actions justify-end">
              <button className="btn btn-error">Delete</button>
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
