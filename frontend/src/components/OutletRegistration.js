import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import "../styles.css";

function OutletRegistration() {
    const history = useHistory();
    const [formData, setFormData] = useState({
        name: '',
        type: ''
    });

    const [message, setMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target; 
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, type } = formData;

        try {
            await axios.post('http://localhost:8080/outletregistration', { name, type });
            setMessage('Outlet registered successfully!');
            setIsRegistered(true);
            history.push(`/${name}`); // Redirects to the outlet's dynamic page
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
        <div className="register template d-flex justify-content-center align-items-center vh-100 bg-light">
          <div class="jumbotron">
          <h1 class="display-4">Welcome to DigiDonor!</h1>
          <p class="lead">Secure and stress-free donation services</p>
          <hr class="my-4"/>
          <p>Built using Hyperledger Fabric</p>
          
          </div>
          {isRegistered ? (
          <div className="text-center mt-3">
              <p>{message}</p>
              <Link to={`/${formData.name}`} className="btn btn-primary">Outlet Page</Link>
          </div>
          ) : (
          <div className="form_container p-5 rounded bg-white ms-4">
            <form onSubmit={handleSubmit}>
              <h3 className="text-center">Register</h3>
              <div className="mb-2">
                <label htmlFor="username">Name:</label>
                <input
                  type="text"
                  name="Name"
                  defaultValue={formData.username}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="form-control"
                />
              </div>
              <div className="mb-2">
              <label htmlFor="type">Store Type:</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-control"
                >
                    <option value="meals">Meals</option>
                    <option value="sports">Sports</option>
                    <option value="tuckshop">Tuckshop</option>
                    <option value="stationary">Stationary</option>
                </select>
              </div>
            
              <div className="d-grid">
                <button type="submit" className="btn btn-outline-success">Register Outlet</button>
              </div>
            </form>
        </div>
        )}
      </div>
    );
}

export default OutletRegistration;
