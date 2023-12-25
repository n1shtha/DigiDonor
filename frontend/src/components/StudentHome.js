import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

function StudentHome() {
  var [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUsername");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  const [formData, setFormData] = useState({
    reqID: "",
    amount: 0,
    purpose: "",
  });

  const generateRandomID = () => {
    const randomID = "ID_" + Math.random().toString(36).substr(2, 9);
    document.getElementById("randomIDGen").value = randomID;
    setFormData({ reqID: randomID });
  };

  const [message, setMessage] = useState("");

  const [tableData, setTableData] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    //e.preventDefault();
    const { name, value } = e.target;
    // console.log(`Effect of change - Name: ${name}, Value: ${value}`);
    // setFormData({ ...formData, [name]: value });
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseInt(value, 10) : value, // Q: check if this is parsing properly, idts
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { reqID, amount, purpose } = formData;
    const username = loggedInUser; // note: don't JSON.stringify username, doesn't work for wallet querying I guess

    try {
      await axios.post("http://localhost:8080/newrequest", {
        reqID,
        username,
        amount,
        purpose,
      });
      setMessage("Request raised successfully!");
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

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUsername");
    navigate("/login");
  };

  const handleFetch = async (e) => {
    e.preventDefault();

    const username = loggedInUser;

    try {
      const previousRequestsResponse = await axios.post(
        "http://localhost:8080/previousrequests",
        { username }
      );

      setTableData(previousRequestsResponse.data);
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
        <div className="row">
          <div className="col">
            <h4 className="m-2 text-center">Browse past requests</h4>
            <div className="form-container p-5 rounded bg-white">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Recipient</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Purpose</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((request) => (
                    <tr key={request.reqID}>
                      <td>{request.reqID}</td>
                      <td>{request.recipient}</td>
                      <td>{request.amount}</td>
                      <td>{request.purpose}</td>
                      <td>{request.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                class="btn btn-outline-info"
                type="submit"
                onClick={handleFetch}
              >
                Fetch results
              </button>
            </div>
          </div>
          <div className="col">
            <h4 className="m-2 text-center">Create new request</h4>
            <div className="form-container p-5 rounded bg-white">
              <form onSubmit={handleSubmit}>
                <div class="input-group mb-3">
                  <button
                    class="btn btn-outline-info"
                    type="button"
                    onClick={generateRandomID}
                  >
                    Generate ID
                  </button>
                  <input
                    className="form-control w-25"
                    type="text"
                    id="randomIDGen"
                    defaultValue={formData.reqID}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <label htmlFor="amount" className="mt-4">
                  Request amount:
                </label>
                <div className="form-check form-check-inline ms-3 mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="amount"
                    id="100"
                    value="100"
                    defaultChecked={formData.amount === 100}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="100">
                    100 INR
                  </label>
                </div>
                <div className="form-check form-check-inline mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="amount"
                    id="250"
                    value="250"
                    defaultChecked={formData.amount === 250}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="250">
                    250 INR
                  </label>
                </div>
                <div className="form-check form-check-inline mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="amount"
                    id="500"
                    value="500"
                    defaultChecked={formData.amount === 500}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="500">
                    500 INR
                  </label>
                </div>
                <div className="form-check form-check-inline mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="amount"
                    id="1000"
                    value="1000"
                    defaultChecked={formData.amount === 1000}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="1000">
                    1000 INR
                  </label>
                </div>
                <label htmlFor="type">Request type:</label>
                <div className="form-check form-check-inline ms-3 mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="purpose"
                    id="meal"
                    value="meal"
                    defaultChecked={formData.purpose === "meal"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="meal">
                    Meal
                  </label>
                </div>
                <div className="form-check form-check-inline mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="purpose"
                    id="stationary"
                    value="stationary"
                    defaultChecked={formData.purpose === "stationary"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="stationary">
                    Stationary
                  </label>
                </div>
                <div className="form-check form-check-inline mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="purpose"
                    id="books"
                    value="books"
                    defaultChecked={formData.purpose === "books"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="books">
                    Books
                  </label>
                </div>
                <div className="form-check form-check-inline mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="purpose"
                    id="decoration"
                    value="decoration"
                    defaultChecked={formData.purpose === "decoration"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="decoration">
                    Decoration
                  </label>
                </div>
                <div className="mb-3">
                  <label for="big-text" className="form-label">
                    Description of request (optional):
                  </label>
                  <textarea
                    className="form-control"
                    id="big-text"
                    rows="3"
                  ></textarea>
                </div>
                <button class="btn btn-outline-success mb-1" type="submit">
                  Create
                </button>
              </form>
            </div>
            <h4 className="mt-4 mb-2 text-center">Redeem a token</h4>
            <div className="form-container p-5 rounded bg-white">
              <div class="input-group mb-1">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Request ID"
                />
                <button class="btn btn-outline-success" type="button">
                  Redeem
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

export default StudentHome;
