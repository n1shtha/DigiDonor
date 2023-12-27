import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SuccessPage() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInStudent");
    navigate("/login");
  };

  const handleRedeemRedirect = async (e) => {
    e.preventDefault();
    navigate("/student");
  };

  return (
    <div class="px-4 pt-5 my-5 text-center">
      <h1 class="display-4 fw-bold">Success!</h1>
      <div class="col-lg-6 mx-auto">
        <p class="lead mb-4 mt-4">
          The money has been transferred and your item has been purchased! Enjoy
          and thank you for using DigiDonor.
        </p>
        <div>
          <p className="mt-2">
            Would you like to redeem another donation or logout?
          </p>
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
            <button
              type="button"
              class="btn btn-success btn-lg px-4 me-sm-3"
              onClick={handleRedeemRedirect}
            >
              Redeem
            </button>
            <button
              type="button"
              class="btn btn-danger btn-lg px-4 me-sm-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div class="overflow-hidden">
          <div class="container px-5">
            <img
              src={process.env.PUBLIC_URL + "au2.jpeg"}
              class="img-fluid border rounded-3 shadow-lg mb-4"
              alt="Ashoka image"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <p className="text-secondary mt-4">
        Created by Chanchal Bajoria and Nishtha Das, for CS-2361: Blockchain &
        Cryptocurrencies with Prof. Mahavir Jhawar.
      </p>
    </div>
  );
}

export default SuccessPage;
