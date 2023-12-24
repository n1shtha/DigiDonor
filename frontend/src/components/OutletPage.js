import React from "react";
import { useParams } from "react-router-dom";
import "../styles.css";

function OutletPage() {
  const { outlet } = useParams(); // Get the dynamic outlet name from the route

  return (
    <div className="outlet template d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to {outlet}'s page !</h1>
        <p class="lead">Secure and stress-free donation services</p>
        <hr class="my-4" />
        <p>Built using Hyperledger Fabric</p>
      </div>
      <div className="form_container p-5 rounded bg-white ms-4">
        <form>
          <h3 className="text-center">Redeem token</h3>
          <div className="mb-2">
            <label htmlFor="Token_ID">Token ID:</label>
            <input
              type="text"
              name="Token_ID"
              placeholder="Enter token ID"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="form-control"
            />
          </div>

          <div className="d-grid">
            <button type="redeem" className="btn btn-outline-success">
              Redeem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OutletPage;
