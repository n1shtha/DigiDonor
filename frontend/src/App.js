import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StudentHome from "./components/StudentHome";
import DonorHome from "./components/DonorHome";
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
