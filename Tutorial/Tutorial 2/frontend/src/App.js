// Import React and Component class
import React, { Component } from 'react';

// Import routing components
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

// Import pages
import AuthPage from './pages/Auth';        // Login & Signup page
import BookingsPage from './pages/Bookings'; // User bookings page
import EventsPage from './pages/Events';    // Events listing page

// Import navigation component
import MainNavigation from './components/Navigation/MainNavigation';

// Import Auth Context (global authentication state)
import AuthContext from './context/auth-context';

// Import CSS styling
import './App.css';

class App extends Component {

  // ===============================
  // COMPONENT STATE
  // ===============================
  // Stores authentication data globally
  state = {
    token: null,   // JWT token (null = not logged in)
    userId: null   // Logged-in user's ID
  };

  // ===============================
  // LOGIN METHOD
  // ===============================
  // Called after successful authentication
  login = (token, userId, tokenExpiration) => {
    // Save token and userId in state
    // (tokenExpiration is received but not used here)
    this.setState({ token: token, userId: userId });
  };

  // ===============================
  // LOGOUT METHOD
  // ===============================
  logout = () => {
    // Clear authentication state
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      // BrowserRouter enables routing in React
      <BrowserRouter>
        <React.Fragment>

          {/* 
            AuthContext.Provider makes authentication data
            available to ALL child components
          */}
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            {/* Navigation bar (visible on all pages) */}
            <MainNavigation />

            <main className="main-content">

              {/* 
                Switch ensures only ONE route renders at a time
              */}
              <Switch>

                {/* 
                  If logged in:
                  Redirect "/" → "/events"
                */}
                {this.state.token && 
                  <Redirect from="/" to="/events" exact />
                }

                {/* 
                  If logged in:
                  Prevent access to "/auth"
                  Redirect to "/events"
                */}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}

                {/* 
                  If NOT logged in:
                  Allow access to authentication page
                */}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}

                {/* 
                  Events page is always accessible
                */}
                <Route path="/events" component={EventsPage} />

                {/* 
                  Bookings page is protected
                  Only accessible if logged in
                */}
                {this.state.token && (
                  <Route path="/bookings" component={BookingsPage} />
                )}

                {/* 
                  If NOT logged in and trying to access protected routes:
                  Redirect to /auth
                */}
                {!this.state.token && <Redirect to="/auth" exact />}

              </Switch>
            </main>

          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

// Export App component
export default App;
