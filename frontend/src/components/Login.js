import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles.css";

function Login() {

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // const usernameRef = useRef(null);
    // const passwordRef = useRef(null);

    const [message, setMessage] = useState('');

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    /** 
    const handleNavigation = async () => 
    {

      /** 
      e.preventDefault();
      console.log("Entered function");
      const username = e.target.username.value
      console.log(username);
      

      const username = usernameRef.current.value;
      console.log(username);

      try {

        console.log("Entered try-catch block.");
        await axios.post('http://localhost:8080/users', username);
        setMessage(true);
        console.log(message);

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

      try {

        console.log("Entered second try-catch block.");
        if (message) {
          const response = await axios.get('http://localhost:8080/users');
          var userType = response.data;

          if (userType === "student"){
            navigate("/student");
          } else if (userType === "donor") {
            navigate("/donor");
          } else {
            navigate("/");
          }
        } else {
          var userType = null;
        }
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
      
    }
    
    */
    
    const handleChange = (e) => {
        const { name, value } = e.target; 
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password, userType } = formData;
        // const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
        // const username = (firstName.toLowerCase() + " " + lastName.toLowerCase());
        // const username = formData.firstName + formData.lastName;

        try {
            await axios.post('http://localhost:8080/login', { username, password, userType });
            setMessage('User logged in successfully!');
            setIsAuthenticated(true);

            if (userType === "student") {
              navigate("/student");
            } else if (userType === "donor") {
              navigate("/donor");
            } else {
              navigate("/");
            }
            // handleNavigation();
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
      <div className="form_container p-5 rounded bg-white ms-4">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center">Login</h3>
          <div className="mb-2">
            <label htmlFor="username">Username:</label>
            <input
              // ref={usernameRef}
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
              // ref={passwordRef}
              type="password"
              name="password"
              defaultValue={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="form-control"
            />
          </div>
          <div className="form-check form-check-inline mb-2">
            <input 
                className="form-check-input" 
                type="radio" 
                name="userType" 
                id="student" 
                defaultValue="student" 
                checked={formData.userType === 'student'} 
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="student">
                Student
            </label>
          </div>
          <div className="form-check form-check-inline mb-2">
              <input 
                  className="form-check-input" 
                  type="radio" 
                  name="userType" 
                  id="donor" 
                  defaultValue="donor" 
                  checked={formData.userType === 'donor'} 
                  onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="donor">
                  Donor
              </label>
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
    </div>
  );
}

export default Login;
