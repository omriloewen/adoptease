import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send email to backend for password reset
    const response = await fetch(
      "http://localhost:5000/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (response.ok) {
      alert(".בידקו את המייל שלכם עבור קישור לאיפוס הסיסמא");
      navigate("/login");
    } else {
      alert("כתובת המייל לא נמצאה.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }} dir="rtl">
      <h2>איפוס סיסמא</h2>
      <form onSubmit={handleSubmit}>
        <label>כתובת מייל</label>
        <input
          dir="ltr"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-control"
        />
        <button type="submit" className="btn btn-primary mt-3">
          שלח קישור לאיפוס סיסמה
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
