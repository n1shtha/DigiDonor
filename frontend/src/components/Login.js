import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "../styles.css";

function Login() {

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [message, setMessage] = useState('');

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target; 
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = formData;
        // const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
        // const username = (firstName.toLowerCase() + " " + lastName.toLowerCase());
        // const username = formData.firstName + formData.lastName;

        try {
            await axios.post('http://localhost:8080/login', { username, password });
            setMessage('User logged in successfully!');
            setIsAuthenticated(true);
        } catch (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              setMessage(error.response.data.error);
            } else if (error.request) {
              // The request was made but no response was received
              setMessage('No response received from the server');
            } else {
              // Something happened in setting up the request that triggered an Error
              setMessage('An error occurred while setting up the request');
            }
          }
    };
  return (
    <div className="login template d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="jumbotron">
      <h1 class="display-4">Welcome to DigiDonor!</h1>
      <p class="lead">Secure and stress-free donation services</p>
      <hr class="my-4"/>
      <p>Built using Hyperledger Fabric</p>
      <a class="btn btn-outline-secondary btn-lg" href="#" role="button">Learn more</a>
      </div>
      {isAuthenticated ? (
      <div className="text-center mt-3">
          <p>{message}</p>
          <Link to="/student" className="btn btn-primary">Go to Student Dashboard [placeholder]</Link>
      </div>
      ) : (
      <div className="form_container p-5 rounded bg-white ms-4">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center">Login</h3>
          <div className="mb-2">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              defaultValue={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              defaultValue={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <input
              type="checkbox"
              className="custom-control custom-checkbox"
              id="check"
            />
            <label htmlFor="check" className="custom-input-label ms-2">
              Remember me
            </label>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-outline-success">Login</button>
          </div>
          <p className="text-end mt-2">
            <a>New user?</a>
            <Link to="/signup" className="ms-2">Sign up</Link>
          </p>
        </form>
      </div>
      )}
    </div>
  );
}

export default Login;
