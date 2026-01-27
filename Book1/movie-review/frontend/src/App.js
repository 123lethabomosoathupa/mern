import React from 'react'
import { Switch, Route, Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import AddReview from "./components/add-review"
import MoviesList from "./components/movies-list"
import Movie from "./components/movie"
import Login from "./components/login"
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

function App() {
  // Initialize user from localStorage
  const [user, setUser] = React.useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  async function login(user = null) {
    // Save to both state and localStorage
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  async function logout() {
    // Remove from both state and localStorage
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Movie Reviews</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto"> 
            <Nav.Link>
              <Link to={"/movies"}>Movies</Link>
            </Nav.Link> 
            <Nav.Link>
              {user ? (
                <a onClick={logout} style={{cursor: 'pointer'}}>
                  Logout {user.name}
                </a>
              ) : (
                <Link to={"/login"}>Login</Link>
              )} 
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Switch>
        <Route exact path={["/", "/movies"]} component={MoviesList} />
        
        <Route 
          path="/movies/:id/review" 
          render={(props) => (
            <AddReview {...props} user={user} />
          )}
        />
        
        <Route 
          path="/movies/:id/" 
          render={(props) => (
            <Movie {...props} user={user} />
          )}
        />
        
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

export default App;