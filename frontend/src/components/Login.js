import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function Login() {
  return (
    <div className="login template d-flex justify-content-center align-items-center 100-w vh-100 bg-light">
      <div class="jumbotron">
      <h1 class="display-4">Welcome to DigiDonor!</h1>
      <p class="lead">Secure and stress-free donation services</p>
      <hr class="my-4"/>
      <p>Built using Hyperledger Fabric</p>
      <a class="btn btn-outline-secondary btn-lg" href="#" role="button">Learn more</a>
      </div>
      <div className="form_container p-5 rounded bg-white ms-4">
        <form>
          <h3 className="text-center">Login</h3>
          <div className="mb-2">
            <label htmlFor="userID">User ID:</label>
            <input
              type="text"
              placeholder="Enter user ID"
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
            <button className="btn btn-outline-success">Login</button>
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
