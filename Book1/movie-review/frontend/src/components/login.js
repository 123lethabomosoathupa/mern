// Import React and useState hook for managing state
import React, { useState } from 'react'

// Import Bootstrap form and button components
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// Functional component for user login
const Login = props => {
 
  // State to store the username
  const [name, setName] = useState("")

  // State to store the user ID
  const [id, setId] = useState("") 

  // Update name state when user types in username field
  const onChangeName = e => {
    const name = e.target.value
    setName(name)
  } 

  // Update ID state when user types in ID field
  const onChangeId = e => {
    const id = e.target.value
    setId(id)
  } 

  // Handle login action
  const login = () => {
    // Pass user details to parent component
    props.login({ name: name, id: id })

    // Redirect user to the home page after login
    props.history.push('/')
  } 

  return (
    <div>
      {/* Login form */}
      <Form>

        {/* Username input */}
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={onChangeName}
          />
        </Form.Group>

        {/* User ID input */}
        <Form.Group>
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter id"
            value={id}
            onChange={onChangeId}
          />
        </Form.Group> 

        {/* Submit button */}
        <Button variant="primary" onClick={login}>
          Submit
        </Button>

      </Form> 
    </div>
  )
}

// Export Login component for use in other files
export default Login;
