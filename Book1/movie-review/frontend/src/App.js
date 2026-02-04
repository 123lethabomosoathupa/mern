// Import React
import React from 'react'

// Routing components from React Router
import { Switch, Route, Link } from "react-router-dom"

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css"

// Import application components
import AddReview from "./components/add-review"
import MoviesList from "./components/movies-list"
import Movie from "./components/movie"
import Login from "./components/login"

// Bootstrap navigation components
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

function App() {

  // User state initialized from localStorage (persists login on refresh)
  const [user, setUser] = React.useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  // Login function: saves user to state and localStorage
  async function login(user = null) {
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  // Logout function: clears user from state and localStorage
  async function logout() {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <div className="App">

      {/* Navigation bar */}
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Movie Reviews</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto"> 

            {/* Movies page link */}
            <Nav.Link>
              <Link to={"/movies"}>Movies</Link>
            </Nav.Link> 

            {/* Login / Logout link */}
            <Nav.Link>
              {user ? (
                <a onClick={logout} style={{ cursor: 'pointer' }}>
                  Logout {user.name}
                </a>
              ) : (
                <Link to={"/login"}>Login</Link>
              )} 
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Application routes */}
      <Switch>

        {/* Home and Movies list route */}
        <Route
          exact
          path={["/", "/movies"]}
          component={MoviesList}
        />

        {/* Add or Edit review route */}
        <Route
          path="/movies/:id/review"
          render={(props) => (
            <AddReview {...props} user={user} />
          )}
        />

        {/* Single movie details route */}
        <Route
          path="/movies/:id/"
          render={(props) => (
            <Movie {...props} user={user} />
          )}
        />

        {/* Login route */}
        <Route
          path="/login"
          render={(props) => (
            <Login {...props} login={login} />
          )}
        />

      </Switch> 
    </div>
  );
}

// Export App component
export default App;
