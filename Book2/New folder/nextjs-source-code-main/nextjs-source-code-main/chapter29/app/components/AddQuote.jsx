"use client";
import { useState } from "react";

const AddQuote = ({refreshQuotes}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState("");
  const [newQuoteBy, setNewQuoteBy] = useState("");

  const handleSubmitNewQuote = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/quotes/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        quote: newQuote,
        by: newQuoteBy,
      }),
    });
    if (res.ok) {
      setNewQuote("");
      setNewQuoteBy("");
      setModalOpen(false);
      refreshQuotes();
    }
  };

  return (
    <div>
      <button className="btn" onClick={() => setModalOpen(true)}>
        Add New Quote
      </button>
      <dialog
        id="my_modal_3"
        className={`modal ${modalOpen ? "modal-open" : ""}`}
      >
        <form
          method="dialog"
          className="modal-box"
          onSubmit={handleSubmitNewQuote}
        >
          <button
            onClick={() => setModalOpen(false)}
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Add Quote</h3>
          {/* quote input field */}
          <input
            type="text"
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            placeholder="Enter a new quote..."
            className="input input-bordered w-full max-w-xs"
          />
          {/* by input field */}
          <input
            type="text"
            value={newQuoteBy}
            onChange={(e) => setNewQuoteBy(e.target.value)}
            placeholder="Enter who the quote is by..."
            className="input input-bordered w-full max-w-xs"
          />
          <br />
          <button type="submit" className="btn btn-primary">
            Add New Quote
          </button>
        </form>
      </dialog>
    </div>
  );
};
export default AddQuote;
