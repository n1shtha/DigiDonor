import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function StudentHome() {

    const generateRandomID = (event) => {
        event.preventDefault();
        const randomID = 'ID_' + Math.random().toString(36).substr(2, 9);
        document.getElementById("randomIDGen").value = randomID;
      };

    return (
        <div className="bg-light">
            <nav className="navbar navbar-light bg-dark">
                <span className="navbar-brand ms-4 mb-0 h1 text-secondary">DigiDonor</span>
            </nav>
            <div className="container mt-4">
                <div className="row">
                    <div className="col">
                        <h4 className="m-2 text-center">Browse past requests</h4>
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
                        </div>
                    </div>
                    <div className="col">
                        <h4 className="m-2 text-center">Create new request</h4>
                        <div className="form-container p-5 rounded bg-white">
                            <form>
                            <div class="input-group mb-3">
                            <button class="btn btn-outline-info" type="button" onClick={generateRandomID}>Generate ID</button>
                            <input type="text" id="randomIDGen" class="form-control w-25" readOnly/>
                            </div>
                            <label htmlFor="amount" className="mt-4">Request amount:</label>
                                <div className="form-check form-check-inline ms-3 mb-3">
                                    <input className="form-check-input" type="radio" name="requestAmount" id="100" value="100 INR"/>
                                    <label className="form-check-label" for="100">
                                        100 INR
                                    </label>
                                </div>
                                <div className="form-check form-check-inline mb-3">
                                    <input className="form-check-input" type="radio" name="requestAmount" id="250" value="250 INR"/>
                                    <label className="form-check-label" for="250">
                                        250 INR
                                    </label>
                                </div>
                                <div className="form-check form-check-inline mb-3">
                                    <input className="form-check-input" type="radio" name="requestAmount" id="500" value="500 INR"/>
                                    <label className="form-check-label" for="500">
                                        500 INR
                                    </label>
                                </div>
                                <div className="form-check form-check-inline mb-3">
                                    <input className="form-check-input" type="radio" name="requestAmount" id="1000" value="1000 INR"/>
                                    <label className="form-check-label" for="1000">
                                        1000 INR
                                    </label>
                                </div>
                                <label htmlFor="type">Request type:</label>
                                <div className="form-check form-check-inline ms-3 mb-3">
                                    <input className="form-check-input" type="radio" name="requestType" id="meal" value="Meal"/>
                                    <label className="form-check-label" for="meal">
                                        Meal
                                    </label>
                                </div>
                                <div className="form-check form-check-inline mb-3">
                                    <input className="form-check-input" type="radio" name="requestType" id="stationary" value="Stationary"/>
                                    <label className="form-check-label" for="stationary">
                                        Stationary
                                    </label>
                                </div>
                                <div className="form-check form-check-inline mb-3">
                                    <input className="form-check-input" type="radio" name="requestType" id="books" value="Books"/>
                                    <label className="form-check-label" for="books">
                                        Books
                                    </label>
                                </div>
                                <div className="form-check form-check-inline mb-3">
                                    <input className="form-check-input" type="radio" name="requestType" id="decoration" value="Decoration"/>
                                    <label className="form-check-label" for="decoration">
                                        Decoration
                                    </label>
                                </div>
                                <div className="mb-3">
                                <label for="big-text" className="form-label">Description of request (optional):</label>
                                <textarea className="form-control" id="big-text" rows="3"></textarea>
                                </div>
                                <button class="btn btn-outline-success mb-1" type="button">Create</button>
                            </form>
                        </div>
                        <h4 className="mt-4 mb-2 text-center">Redeem a token</h4>
                        <div className="form-container p-5 rounded bg-white">
                            <div class="input-group mb-1">
                            <input type="text" class="form-control" placeholder="Request ID"/>
                            <button class="btn btn-outline-success" type="button">Redeem</button>
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