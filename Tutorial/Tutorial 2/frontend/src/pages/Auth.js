// Import React and Component class
import React, { Component } from 'react';

// Import CSS styling
import './Auth.css';

// Import authentication context (global auth state)
import AuthContext from '../context/auth-context';

class AuthPage extends Component {

  // ===============================
  // COMPONENT STATE
  // ===============================
  state = {
    isLogin: true // true = Login mode, false = Signup mode
  };

  // Allows this component to access AuthContext using this.context
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    // Create refs to directly access input field values
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  // ===============================
  // SWITCH BETWEEN LOGIN & SIGNUP
  // ===============================
  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin }; // Toggle mode
    });
  };

  // ===============================
  // FORM SUBMIT HANDLER
  // ===============================
  submitHandler = event => {
    event.preventDefault(); // Prevent page reload

    // Get input values from refs
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    // Basic validation
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    // ===============================
    // DEFAULT REQUEST (LOGIN)
    // ===============================
    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    // ===============================
    // IF SIGNUP MODE → USE MUTATION
    // ===============================
    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    }

    // ===============================
    // SEND REQUEST TO BACKEND
    // ===============================
    // FIX #1: use port 8000 to match backend
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {

        // Check for successful response
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }

        return res.json();
      })
      .then(resData => {

        // ===============================
        // IF LOGIN SUCCESSFUL
        // ===============================
        // FIX #3: Only access login data when logging in
        if (this.state.isLogin && resData.data.login) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }

        // ===============================
        // IF SIGNUP SUCCESSFUL
        // ===============================
        // Automatically switch back to login mode
        if (!this.state.isLogin && resData.data.createUser) {
          this.setState({ isLogin: true });
        }
      })
      .catch(err => {
        // Handle errors
        console.log(err);
      });
  };

  // ===============================
  // RENDER METHOD
  // ===============================
  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>

        {/* Email Input */}
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>

        {/* Password Input */}
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="submit">Submit</button>

          {/* Toggle between Login & Signup */}
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
