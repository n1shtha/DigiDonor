import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles.css";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    userType: "student",
  });

  const [message, setMessage] = useState("");

  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, password, userType } = formData;

    try {
      await axios.post("http://localhost:8080/signup", {
        firstName,
        lastName,
        password,
        userType,
      });
      setMessage("User registered successfully!");
      setIsRegistered(true);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setMessage(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        setMessage("No response received from the server");
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage("An error occurred while setting up the request");
      }
    }
  };

  return (
    <div className="signup-template">
      <div className="signup-header d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="jumbotron">
          <h1 className="display-4">Welcome to DigiDonor!</h1>
          <p className="lead">Secure and stress-free donation services</p>
          <hr className="my-4" />
          <p>Built using Hyperledger Fabric</p>
          <a
            className="btn btn-outline-secondary btn-lg"
            href="#"
            role="button"
          >
            Learn more
          </a>
        </div>
        <div className="signup-form d-flex justify-content-center align-items-center">
          {isRegistered ? (
            <div className="text-center mt-3">
              <p>{message}</p>
              <Link to="/login" className="btn btn-primary">
                Go to Login
              </Link>
            </div>
          ) : (
            <div className="form-container p-5 rounded bg-white ms-4">
              <form onSubmit={handleSubmit}>
                <h3 className="text-center">Sign up</h3>
                <div className="mb-2">
                  <label htmlFor="firstName">First name:</label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="form-control"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="lastName">Last name:</label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="form-control"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="form-control"
                    defaultValue={formData.password}
                    onChange={handleChange}
                    name="password"
                  />
                </div>
                <div className="form-check form-check-inline mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="userType"
                    id="student"
                    defaultValue="student"
                    checked={formData.userType === "student"}
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
                    checked={formData.userType === "donor"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="donor">
                    Donor
                  </label>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-outline-success">
                    Sign up
                  </button>
                </div>
                <p className="text-end mt-2">
                  Already registered?{" "}
                  <Link to="/" className="ms-2">
                    Login
                  </Link>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
