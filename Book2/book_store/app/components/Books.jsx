"use client"; // This tells Next.js this is a client-side component

import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingPage from "../loading";
import AddBook from "./AddBook";

const Books = () => {
  // State to store books fetched from the API
  const [books, setBooks] = useState([]);

  // State to track loading state (used for spinner/page)
  const [loading, setLoading] = useState(true);

  // State to store search query input
  const [query, setQuery] = useState("");

  // Function to fetch all books from API
  const fetchBooks = async () => {
    const res = await fetch("/api/books"); // Call API endpoint
    const books = await res.json(); // Convert response to JSON
    setBooks(books); // Update books state
    setLoading(false); // Stop loading
  };

  // Runs once when component mounts (like componentDidMount)
  useEffect(() => {
    fetchBooks();
  }, []);

  // If still loading, show loading page/component
  if (loading) {
    return <LoadingPage />;
  }

  // Handle search form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    setLoading(true); // Show loading state

    // Fetch books based on search query
    const res = await fetch(`/api/books/search?query=${query}`);
    const books = await res.json();

    setBooks(books); // Update books list with search results
    setLoading(false); // Stop loading
  };

  // Function to delete a book by ID
  const deleteBook = async (id) => {
    const res = await fetch(`api/books/${id}`, {
      method: "DELETE", // Send DELETE request
    });

    // Refresh book list after deletion
    fetchBooks();
  };

  return (
    <div>
      {/* Search Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update query state as user types
          className="input input-bordered w-full max-w-xs"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* Component to add a new book */}
      <AddBook refreshBooks={fetchBooks} />

      {/* Loop through books and display each one */}
      {books.map((book) => (
        <div key={book._id}>
          <div className="card w-96 bg-base-100 shadow-xl">
            <figure>
              {/* Display book image */}
              <img src={book.img} width="200" height="150" />
            </figure>

            <div className="card-body">
              {/* Display book ID */}
              <h2 className="card-title">{book._id}</h2>

              {/* Display book title */}
              <p>{book.title}</p>

              <div className="card-actions justify-end">
                {/* Link to external Amazon page */}
                <Link href={book.link} className="btn btn-primary">
                  See in Amazon
                </Link>

                {/* Delete button */}
                <button
                  onClick={() => deleteBook(book._id)}
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

export default Books;