import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PasswordChange = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  const { oldPassword, newPassword, confirmPassword } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update passwordMatch state
    if (name === "newPassword" || name === "confirmPassword") {
      setPasswordMatch(
        formData.newPassword === value || formData.confirmPassword === value
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch || newPassword !== confirmPassword) {
      alert("הסיסמאות אינן תואמות");
      return;
    }

    const token = localStorage.getItem("token"); // Assuming you're using localStorage for tokens

    const response = await fetch(
      "http://localhost:5000/api/users/change-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      }
    );

    if (response.status === 401) {
      // If the token is invalid, redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      localStorage.removeItem("name");
      navigate("/login");
    }

    const data = await response.json();

    if (response.ok) {
      alert("הסיסמא שונתה בהצלחה");
      navigate("/settings");
    } else {
      alert(data.message || "Failed to change password");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">החלפת סיסמא</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3 text-end">
                  <input
                    type="password"
                    className="form-control"
                    id="oldPassword"
                    name="oldPassword"
                    placeholder="סיסמא ישנה"
                    value={oldPassword}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="oldPassword"
                    style={{ right: 0, left: "auto" }}
                  >
                    סיסמא ישנה
                  </label>
                  {!passwordMatch && (
                    <div className="invalid-feedback">הסיסמאות אינן תואמות</div>
                  )}
                </div>
                <div className="form-floating mb-3 text-end">
                  <input
                    type="password"
                    className={`form-control ${
                      !passwordMatch ? "is-invalid" : ""
                    }`}
                    id="newPassword"
                    name="newPassword"
                    placeholder="סיסמא חדשה"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <label
                    htmlFor="newPassword"
                    style={{ right: 0, left: "auto" }}
                  >
                    סיסמא חדשה
                  </label>
                  {!passwordMatch && (
                    <div className="invalid-feedback">הסיסמאות אינן תואמות</div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="form-floating mb-3 text-end">
                  <input
                    type="password"
                    className={`form-control ${
                      !passwordMatch ? "is-invalid" : ""
                    }`}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="אשר סיסמא"
                    value={confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <label
                    htmlFor="confirmPassword"
                    style={{ right: 0, left: "auto" }}
                  >
                    אשר סיסמא
                  </label>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-block">
                    שינוי סיסמא
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
