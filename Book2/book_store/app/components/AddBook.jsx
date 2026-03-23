"use client"; // Marks this as a client-side component in Next.js

import { useState } from "react";

const AddBook = ({ refreshBooks }) => {
  // Controls whether the modal is open or closed
  const [modalOpen, setModalOpen] = useState(false);

  // Stores the new book title input value
  const [newBookTitle, setNewBookTitle] = useState("");

  // Handles form submission when adding a new book
  const handleSubmitNewBook = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Send POST request to API to create a new book
    const res = await fetch(`/api/books/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json", // Tell server we're sending JSON
      },
      body: JSON.stringify({
        title: newBookTitle, // User input
        link: "https://www.amazon.com/dp/B0979MGJ5J", // Placeholder link
        img: "https://via.placeholder.com/600/92c952", // Placeholder image
      }),
    });

    // If request is successful
    if (res.ok) {
      setNewBookTitle(""); // Clear input field
      setModalOpen(false); // Close modal
      refreshBooks(); // Refresh book list from parent component
    }
  };

  return (
    <div>
      {/* Button to open modal */}
      <button className="btn" onClick={() => setModalOpen(true)}>
        Add Book
      </button>

      {/* Modal (dialog element) */}
      <dialog
        id="my_modal_3"
        className={`modal ${modalOpen ? "modal-open" : ""}`} // Toggle visibility
      >
        {/* Form inside modal */}
        <form
          method="dialog"
          className="modal-box"
          onSubmit={handleSubmitNewBook}
        >
          {/* Close button */}
          <button
            onClick={() => setModalOpen(false)} // Close modal
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>

          {/* Modal title */}
          <h3 className="font-bold text-lg">Add New Book</h3>

          {/* Input field for book title */}
          <input
            type="text"
            value={newBookTitle} // Controlled input
            onChange={(e) => setNewBookTitle(e.target.value)} // Update state
            placeholder="Enter New Book Title"
            className="input input-bordered w-full max-w-xs"
          />

          {/* Submit button */}
          <button type="submit" className="btn btn-primary">
            Add Book
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default AddBook;