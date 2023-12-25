import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

function DonorHome() {
  var [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUsername");
    const storedTokens = localStorage.getItem("tokens");
    
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }

    if (storedTokens) {
      const parsedTokens = JSON.parse(storedTokens);
      setTokenArray(parsedTokens);
      setTokenBalance(parsedTokens.length);
    }
  }, []);
  
  const [formData, setFormData] = useState({
    // note: setFormData doesn't seem to be working when only one key is there so I've done it with the text field's ID instead
    amount: 0,
  });

  const [message, setMessage] = useState("");

  const [openTableData, setOpenTableData] = useState([]);

  const [pastTableData, setPastTableData] = useState([]);

  const [tokenArray, setTokenArray] = useState([]);

  const [tokenBalance, setTokenBalance] = useState(0);

  const navigate = useNavigate();

  const generateTokens = async (e) => {
    e.preventDefault();
    // const { amount } = formData;
    const amount = document.getElementById("donorAmount").value;
    // can we change this to formData?

    if (!amount) {
      setMessage("Please enter a valid amount.");
      return;
    }

    const username = loggedInUser;
    const numberOfTokens = Math.floor(amount / 10);
    // Array to hold the tokens
    const tokens = [];

    try {
      // Generate tokens
      for (let i = 0; i < numberOfTokens; i++) {
        // Generate a random token ID
        const tokenID = Math.floor(Math.random() * 1000000);

        // Create the token object
        const token = {
          tokenID: tokenID,
          donor: username,
          tokenAmount: 10,
        };

        tokens.push(token);
      }

      // also saving it to localStorage
      localStorage.setItem('tokens', JSON.stringify(tokens));

      setTokenArray(tokens);
      // to reflect updated token count after pledging
      setTokenBalance(prevBalance => prevBalance + tokens.length);
    } 
    catch (error) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Effect of change - Name: ${name}, Value: ${value}`);
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseInt(value) : value,
    });
  };

  const handleOpenFetch = async (e) => {
    e.preventDefault();

    const username = loggedInUser;

    try {
      const allOpenRequestsResponse = await axios.post(
        "http://localhost:8080/allopenrequests",
        { username }
      );
      console.log(allOpenRequestsResponse.data);
      setOpenTableData(allOpenRequestsResponse.data);
      setMessage("Data fetched successfully!");
    } catch (error) {
      if (error.response) {
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

  const handlePastFetch = async (e) => {
    e.preventDefault();

    const username = loggedInUser;

    try {
      const previousDonationsResponse = await axios.post(
        "http://localhost:8080/previousdonations",
        { username }
      );

      setPastTableData(previousDonationsResponse.data);
      setMessage("Data fetched successfully!");
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

  console.log(`formdata:`, formData);
  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUsername");
    navigate("/login");
  };

  console.log(`tokenbal:`, tokenBalance);

  const sendPledgeToServer = async (pledge) => {
    const username = loggedInUser;

    try {
        const response = await axios.post(
          "http://localhost:8080/pledge", 
          pledge, 
          username);
        console.log("Pledge sent successfully:", response.data);
    } catch (error) {
        console.error("Error sending pledge:", error);
    }
  }

  const handleSelect = (reqID, amount) => {
    const isConfirmed = window.confirm(`Are you sure you want to select request ID ${reqID}?`);

    if (isConfirmed) {
      // Calculate no. of tokens
      const tokensToPledge = Math.floor(amount / 10);

      // Fetch Tokens Array from localStorage
      let tokens = JSON.parse(localStorage.getItem('tokens'));

      // Remove x tokens from the array
      const pledgedTokens = tokens.splice(0, tokensToPledge);

      // Updated tokens in localStorage
      localStorage.setItem('tokens', JSON.stringify(tokens));

      const pledge = {
        pledgeID: `Pledge_${Math.random().toString(36).substr(2, 9)}`,
        pledgedTokens,
        reqID
      };

      // Adjust token balance after pledge
      setTokenBalance(prevBalance => prevBalance - pledgedTokens.length);

      sendPledgeToServer(pledge);
    }
}

  return (
    <div className="bg-light">
      <nav className="navbar navbar-light bg-dark">
        <span className="navbar-brand ms-4 mb-0 h1 text-secondary">
          DigiDonor
        </span>
        {loggedInUser ? (
          <div>
            <span className="navbar-text text-secondary me-4">
              Welcome, {loggedInUser}!
            </span>
            <span className="btn btn-danger me-4" onClick={handleLogout}>
              Logout
            </span>
          </div>
        ) : (
          <span className="navbar-brand ms-4 mb-0 h1 text-secondary">
            Please log in to access the dashboard.
          </span>
        )}
      </nav>
      <div className="container mt-4">
        <div>
          <span>
            <h3 className="mb-5">Balance: {tokenBalance}</h3>
          </span>
        </div>
        <div>
          <p>
            Ready to donate? Please enter the desired amount (minimum. 10) and
            get your tokens!
          </p>
          <form onSubmit={generateTokens}>
            <div class="input-group mb-5 w-25">
              <input
                type="text"
                id="donorAmount"
                className="form-control"
                placeholder="Amount (INR)"
                defaultValue={formData.amount}
                onChange={handleChange} 
              />
              <button class="btn btn-outline-success" type="submit">
                Generate tokens
              </button>
            </div>
          </form>
        </div>
        <div className="row">
          <div className="col">
            <h4 className="m-2 text-center">Browse past donations</h4>
            <div className="form-container p-5 rounded bg-white">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">ID</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Type</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>Open</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>Open</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>hi</td>
                    <td>test</td>
                    <td>@twitter</td>
                    <td>Open</td>
                  </tr>
                </tbody>
              </table>
              <button class="btn btn-outline-info" type="submit" onClick={handlePastFetch}>
                Fetch data
              </button>
            </div>
          </div>
          <div className="col">
            <h4 className="m-2 text-center">Browse open requests</h4>
            <div className="form-container p-5 rounded bg-white">
            <table class="table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Purpose</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {openTableData.map((request) => (
                    <tr key={request.reqID}>
                      <td>{request.reqID}</td>
                      <td>{request.amount}</td>
                      <td>{request.purpose}</td>
                      <td>{request.status}</td>
                      <td className="hover-button">
                        <button className="select-button" onClick={() => handleSelect(request.reqID, request.amount)}>Select</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button class="btn btn-outline-info" type="submit" onClick={handleOpenFetch}>
                Fetch data
              </button>
            </div>
          </div>
          <div className="col">
            <h4 className="mt-4 mb-2 text-center">Fund a request</h4>
            <div className="form-container p-5 rounded bg-white">
              <div class="input-group mb-1">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Request ID"
                />
                <button class="btn btn-outline-success" type="button">
                  Fund
                </button>
              </div>
            </div>
            <br></br>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorHome;
