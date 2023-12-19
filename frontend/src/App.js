import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Signup from "./Signup";
import StudentHome from "./StudentHome";
import DonorHome from "./DonorHome";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/student" element={<StudentHome />}></Route>
        <Route path="/donor" element={<DonorHome />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
