// Import React and necessary hooks
import React from 'react';

// Import React Router components for routing
import { Switch, Route, Link } from "react-router-dom";

// Import Bootstrap CSS and components for styling
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// Import your page components
import AddReview from "./components/add-review";
import MoviesList from "./components/movies-list";
import Movie from "./components/movie";
import Login from "./components/login";

function App() {
  // State to store the currently logged-in user (null if not logged in)
  const [user, setUser] = React.useState(null);

  // Login function sets the user state
  async function login(user = null) {
    setUser(user);
  }

  // Logout function clears the user state
  async function logout() {
    setUser(null);
  }

  return (
    <div className="App">
      {/* ===================== NAVBAR ===================== */}
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Movie Reviews</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {/* Link to movies list */}
            <Nav.Link>
              <Link to={"/movies"}>Movies</Link>
            </Nav.Link>
            
            {/* Show Login or Logout based on user state */}
            <Nav.Link>
              {user ? (
                <a onClick={logout}>Logout User</a>
              ) : (
                <Link to={"/login"}>Login</Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* ===================== ROUTES ===================== */}
      <Switch>
        {/* Home page and movies list */}
        <Route exact path={["/", "/movies"]} component={MoviesList}>
        </Route>

        {/* Add review page for a specific movie */}
        <Route
          path="/movies/:id/review"
          render={(props) =>
            <AddReview {...props} user={user} />
          }
        >
        </Route>

        {/* Movie details page */}
        <Route
          path="/movies/:id/"
          render={(props) =>
            <Movie {...props} user={user} />
          }
        >
        </Route>

        {/* Login page */}
        <Route
          path="/login"
          render={(props) =>
            <Login {...props} login={login} />
          }
        >
        </Route>
      </Switch>
    </div>
  );
}

// Export App component as the main application
export default App;
