// Import React
import React from 'react';

// Import routing components from React Router
import { Routes, Route } from 'react-router-dom';

// Import page components
import Home from './pages/Home';
import CreateBook from './pages/CreateBooks';
import ShowBook from './pages/ShowBook';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';

const App = () => {
  return (
    // Routes acts as a container for all application routes
    <Routes>

      {/* Home page – displays the list of books */}
      <Route path='/' element={<Home />} />

      {/* Create page – form to add a new book */}
      <Route path='/books/create' element={<CreateBook />} />

      {/* Details page – shows a single book using its ID */}
      <Route path='/books/details/:id' element={<ShowBook />} />

      {/* Edit page – update an existing book using its ID */}
      <Route path='/books/edit/:id' element={<EditBook />} />

      {/* Delete page – confirm and delete a book using its ID */}
      <Route path='/books/delete/:id' element={<DeleteBook />} />

    </Routes>
  );
};

// Export App component so it can be used in index.js
export default App;
