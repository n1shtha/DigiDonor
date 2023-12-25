import React, {useState}  from "react";
import axios from "axios";
import { useParams, useNavigate} from "react-router-dom";
import "../styles.css";

function OutletPage() {
  const { outlet } = useParams(); // Get the dynamic outlet name from the route

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    pledgeID: "",
    username: "",
    item: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/redeem", {
        ...formData,
        outlet,
      });
      if (response.data.success) {
        // redirect to success page
        navigate("/success", { message: response.data.message });
      }
    } catch (error) {
      console.error("Error redeeming:", error);
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
    <div className="outlet template d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to {outlet}'s page !</h1>
        <p class="lead">Secure and stress-free donation services</p>
        <hr class="my-4" />
        <p>Built using Hyperledger Fabric</p>
      </div>
      <div className="form_container p-5 rounded bg-white ms-4">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center">Redeem token</h3>

          <div className="mb-2">
            <label htmlFor="Pledge_ID">Pledge ID:</label>
            <input
              type="text"
              name="Pledge_ID"
              placeholder="Enter pledge ID"
              onChange={handleChange}
              defaultValue={formData.pledgeID}
              className="form-control"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              defaultValue={formData.username}
              className="form-control"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="item">Item:</label>
            <input
              type="text"
              name="item"
              placeholder="Enter item"
              onChange={handleChange}
              defaultValue={formData.item}
              className="form-control"
            />
          </div>

          <div className="d-grid" type="submit">
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
