import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const { token } = useParams(); // Get token from URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    const response = await fetch(
      `http://localhost:5000/api/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      }
    );

    if (response.ok) {
      alert("הסיסמא שונתה בהצלחה");
      navigate("/login");
    } else {
      alert("Failed to reset password.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }} dir="rtl">
      <h2>איפוס סיסמה</h2>
      <form onSubmit={handleSubmit}>
        <label>סיסמה חדשה</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="form-control"
        />
        <label>אשר סיסמה חדשה</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="form-control"
        />
        <button type="submit" className="btn btn-primary mt-3">
          איפוס סיסמה
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
