// Import core React features
import React, { useEffect, useState } from 'react';

// Axios is used for making HTTP requests to the backend
import axios from 'axios';

// Custom loading spinner component
import Spinner from '../components/Spinner';

// Used for client-side navigation
import { Link } from 'react-router-dom';

// Icons (some are imported for use in other components)
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

// Components for displaying books in different layouts
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';

const Home = () => {
  // State to store the list of books fetched from the backend
  const [books, setBooks] = useState([]);

  // State to control the loading spinner
  const [loading, setLoading] = useState(false);

  // State to switch between table view and card view
  const [showType, setShowType] = useState('table');

  // useEffect runs once when the component mounts
  useEffect(() => {
    // Start loading
    setLoading(true);

    // Fetch books from the backend API
    axios
      .get('http://localhost:5555/books')
      .then((response) => {
        // Save fetched books into state
        setBooks(response.data.data);

        // Stop loading after successful fetch
        setLoading(false);
      })
      .catch((error) => {
        // Log any errors
        console.log(error);

        // Stop loading even if an error occurs
        setLoading(false);
      });
  }, []);

  return (
    <div className='p-4'>
      {/* Buttons to toggle between Table and Card views */}
      <div className='flex justify-center items-center gap-x-4'>
        <button
          className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg'
          onClick={() => setShowType('table')}
        >
          Table
        </button>

        <button
          className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg'
          onClick={() => setShowType('card')}
        >
          Card
        </button>
      </div>

      {/* Page heading and Add Book button */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>Books List</h1>

        {/* Link to create a new book */}
        <Link to='/books/create'>
          <MdOutlineAddBox className='text-sky-800 text-4xl' />
        </Link>
      </div>

      {/* Conditional rendering:
          - Show spinner while loading
          - Show table or card layout based on showType */}
      {loading ? (
        <Spinner />
      ) : showType === 'table' ? (
        <BooksTable books={books} />
      ) : (
        <BooksCard books={books} />
      )}
    </div>
  );
};

// Export the Home component
export default Home;
