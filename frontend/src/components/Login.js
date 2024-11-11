import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link component from react-router-dom
import { jwtDecode } from "jwt-decode"; // Correct named import for jwtDecode
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Login = ({ setUserRoles, setUserName }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        localStorage.setItem("token", token); // Store the token

        const decodedToken = jwtDecode(token);
        localStorage.setItem("role", decodedToken.roles);
        localStorage.setItem(
          "name",
          `${decodedToken.firstName} ${decodedToken.lastName}` || ""
        );

        setUserRoles(decodedToken.roles);
        setUserName(`${decodedToken.firstName} ${decodedToken.lastName}` || "");

        alert("התחברת בהצלחה");
        navigate("/");
      } else {
        alert(`Error: ${data.error || "Login failed"}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed.");
    }
  };

  return (
    <div className="container mt-5">
      <Row className="text-center mb-4">
        <Col>
          <h1>ברוכים הבאים ל AdoptEase</h1>
        </Col>
      </Row>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">התחברו לחשבונכם</h3>
              <form onSubmit={handleSubmit}>
                {/* Email Field with Floating Label */}
                <div className="form-floating mb-3 text-end">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="כתובת מייל"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="email" style={{ right: 0, left: "auto" }}>
                    כתובת מייל
                  </label>
                </div>

                {/* Password Field with Floating Label */}
                <div className="form-floating mb-3 text-end">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="סיסמא"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="password" style={{ right: 0, left: "auto" }}>
                    סיסמא
                  </label>
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-block">
                    התחברות
                  </button>
                </div>
              </form>
              {/* Link to Signup */}
              <div className="text-center mt-3">
                <span>אין לכם חשבון? </span>
                <Link to="/signup">הירשמו כאן</Link>
              </div>
              <div className="text-end mt-3">
                <a href="/forgot-password" className="btn btn-link">
                  שכחתי את הסיסמה
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
