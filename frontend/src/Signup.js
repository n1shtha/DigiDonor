import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function Signup() {

    return (
        <div className="signup template d-flex justify-content-center align-items-center 100-w vh-100 bg-light">
        <div class="jumbotron">
            <h1 class="display-4">Welcome to DigiDonor!</h1>
            <p class="lead">Secure and stress-free donation services</p>
            <hr class="my-4"/>
            <p>Built using Hyperledger Fabric</p>
            <a class="btn btn-outline-secondary btn-lg" href="#" role="button">Learn more</a>
        </div>
        <div className="form_container p-5 rounded bg-white ms-4">
            <form>
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
                <input
                type="password"
                placeholder="Enter password"
                className="form-control"
                />
            </div>
            <div className="form-check form-check-inline mb-2">
                <input className="form-check-input" type="radio" name="userType" id="student" value="Student"/>
                <label className="form-check-label" for="student">
                        Student
                </label>
            </div>
            <div className="form-check form-check-inline mb-2">
                <input className="form-check-input" type="radio" name="userType" id="donor" value="Donor"/>
                <label className="form-check-label" for="donor">
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
        </div>
    );
}

export default Signup;