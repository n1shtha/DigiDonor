import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function Home() {
  const navigate = useNavigate();

  const handleStudentDonorButtonClick = () => {
    navigate("/signup");
  };

  const handleOutletButtonClick = () => {
    navigate("/outletregistration");
  };
  return (
    <div class="px-4 pt-5 my-5 text-center border-bottom">
      <h1 class="display-4 fw-bold">DigiDonor</h1>
      <div class="col-lg-6 mx-auto">
        <p class="lead mb-4 mt-4">
          Welcome to DigiDonor, our innovative donation matching platform!
          Powered by Hyperledger Fabric, our blockchain technology ensures a
          secure and streamlined experience. Ashoka University students can
          easily request specific financial needs from outlets on campus, while
          donors have decentralized control to fund and see through their
          preferred requests securely. Register now and make an immediate impact
          on a student's wellbeing and education!
        </p>

        <div class="overflow-hidden">
          <div class="container px-5">
            <img
              src={process.env.PUBLIC_URL + "au.jpeg"}
              class="img-fluid border rounded-3 shadow-lg mb-4"
              alt="Ashoka image"
              loading="lazy"
            />
          </div>
        </div>
        <div>
          <p className="mt-5">
            We're happy to see you join!<br></br>Please navigate to your
            respective registration page.
          </p>
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
            <button
              type="button"
              class="btn btn-success btn-lg px-4 me-sm-3"
              onClick={handleStudentDonorButtonClick}
            >
              Student
            </button>
            <button
              type="button"
              class="btn btn-success btn-lg px-4 me-sm-3"
              onClick={handleStudentDonorButtonClick}
            >
              Donor
            </button>
            <button
              type="button"
              class="btn btn-success btn-lg px-4 me-sm-3"
              onClick={handleOutletButtonClick}
            >
              Outlet
            </button>
          </div>
        </div>
      </div>
      <p>
        Created by Chanchal Bajoria and Nishtha Das, for CS-2361: Blockchain &
        Cryptocurrencies with Prof. Mahavir Jhawar.
      </p>
    </div>
  );
}

export default Home;
