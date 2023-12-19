import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function DonorHome() {

    return (
        <div className="bg-light">
            <nav className="navbar navbar-light bg-dark">
                <span className="navbar-brand ms-4 mb-0 h1 text-secondary">DigiDonor</span>
            </nav>
            <div className="container mt-4">
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
                        </div>
                    </div>
                    <div className="col">
                        <h4 className="m-2 text-center">Browse open requests</h4>
                        <div className="form-container p-5 rounded bg-white">
                            <table class="table">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">ID</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                    
                                    </tr>
                                    <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                    
                                    </tr>
                                    <tr>
                                    <th scope="row">3</th>
                                    <td>hi</td>
                                    <td>test</td>
                                    <td>@twitter</td>
                                    
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col">
                        <h4 className="mt-4 mb-2 text-center">Explore a request</h4>
                        <div className="form-container p-5 rounded bg-white">
                            <div class="input-group mb-1">
                            <input type="text" class="form-control" placeholder="Request ID"/>
                            <button class="btn btn-outline-success" type="button">Explore</button>
                            </div>
                        </div>
                        <h4 className="mt-4 mb-2 text-center">Create a token</h4>
                        <div className="form-container p-5 rounded bg-white">
                            <div class="input-group mb-1">
                            <input type="text" class="form-control" placeholder="Request ID"/>
                            <button class="btn btn-outline-success" type="button">Create</button>
                            </div>
                        </div>
                        <br>
                        </br>
                    </div>
                </div>
            </div>
        </div>
        
    );
  }
  
  export default DonorHome;