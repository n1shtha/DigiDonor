import React from "react";
import { useLocation } from "react-router-dom";

function SuccessPage() {
  const location = useLocation();
  const { message } = location.state;

  return (
    <div>
      <h1 className="success-message">{message}</h1>
    </div>
  );
}

export default SuccessPage;