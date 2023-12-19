import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "../styles.css";

function Signup() {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        userType: 'student'
    });

    const [message, setMessage] = useState('');

    const [isRegistered, setIsRegistered] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, password, userType } = formData;
        const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;

        try {
            await axios.post('http://localhost:8080/signup', { username, password, userType });
            setMessage('User registered successfully!');
            setIsRegistered(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="signup-template">
            <div className="signup-header d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="jumbotron">
                    <h1 className="display-4">Welcome to DigiDonor!</h1>
                    <p className="lead">Secure and stress-free donation services</p>
                    <hr className="my-4"/>
                    <p>Built using Hyperledger Fabric</p>
                    <a className="btn btn-outline-secondary btn-lg" href="#" role="button">Learn more</a>
                </div>
            </div>
            <div className="signup-form d-flex justify-content-center align-items-center">
                {isRegistered ? (
                    <div className="text-center mt-3">
                        <p>{message}</p>
                        <Link to="/login" className="btn btn-primary">Go to Login</Link>
                    </div>
                ) : (
                    <div className="form-container p-5 rounded bg-white ms-4">
                        <form onSubmit={handleSubmit}>
                        <h3 className="text-center">Sign up</h3>
                        <div className="mb-2">
                            <label htmlFor="fname">First name:</label>
                            <input
                            type="text"
                            placeholder="Enter first name"
                            className="form-control"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="lname">Last name:</label>
                            <input
                            type="text"
                            placeholder="Enter first name"
                            className="form-control"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="password">Password:</label>
                            <input type="password" placeholder="Enter password" className="form-control"
                            />
                        </div>
                        <div className="form-check form-check-inline mb-2">
                                <input 
                                    className="form-check-input" 
                                    type="radio" 
                                    name="userType" 
                                    id="student" 
                                    value="student" 
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
                                    value="donor" 
                                    checked={formData.userType === 'donor'} 
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="donor">
                                    Donor
                                </label>
                            </div>
                        <div className="d-grid">
                            <button className="btn btn-outline-success">Sign up</button>
                        </div>
                        <p className="text-end mt-2">
                            Already registered? <Link to="/" className="ms-2">Login</Link>
                        </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );

}

export default Signup;