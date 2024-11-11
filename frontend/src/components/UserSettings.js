import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const UserSettings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roles: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user data from /me endpoint
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.status === 401) {
        // If the token is invalid, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("name");
        navigate("/login");
      }
      if (response.ok) {
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          roles: data.roles,
        });
      } else {
        alert("Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/users/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 401) {
      // If the token is invalid, redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      localStorage.removeItem("name");
      navigate("/login");
    }

    if (response.ok) {
      alert("הפרטים עודכנו בהצלחה");
      navigate("/");
    } else {
      alert("Failed to update settings");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "בטוחים שברצונכם למחוק את החשבון? לא יהיה ניתן לשחזרו"
    );

    if (confirmDelete) {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/users/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // If the token is invalid, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("name");
        navigate("/login");
      }

      if (response.ok) {
        alert("החשבון נמחק בהצלחה");
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("name");
        // Remove token from localStorage
        navigate("/login"); // Redirect the user to the home page or login after deletion
      } else {
        alert("Failed to delete account.");
      }
    }
  };

  const displayRoles = (roles) => {
    if (roles.includes("manager")) {
      return "מנהל";
    }

    const roleMapping = {
      ac: "הוספת ראיונות",
      vc: "צפייה בראיונות",
      mc: "ניהול ראיונות",
      ad: "הוספת כלבים",
      vd: "צפייה בכלבים",
      md: "ניהול כלבים",
    };

    // Create a filtered list of roles to display
    const roleDisplay = roles.reduce((acc, role) => {
      if (role === "mc") {
        acc.push("ניהול ראיונות"); // Manage Candidates replaces Add and View Candidates
      } else if (role === "md") {
        acc.push("ניהול כלבים"); // Manage Dogs replaces Add and View Dogs
      } else if (roleMapping[role]) {
        acc.push(roleMapping[role]);
      }
      return acc;
    }, []);

    return roleDisplay.length > 0 ? roleDisplay.join(", ") : "אין הרשאות";
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h5 dir="rtl">הגדרות משתמש</h5>
      <div class="accordion" id="accordionPanelsStayOpenExample" dir="rtl">
        <div class="accordion-item" dir="rtl">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              פרטי משתמשים
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            class="accordion-collapse collapse show"
          >
            <div class="accordion-body">
              <form onSubmit={handleSubmit}>
                <div className="list-group mb-3 ">
                  <div className="list-group-item">
                    <div className="input-group  mb-1" dir="rtl">
                      <div className="form-floating mb-3 text-end">
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          dir="rtl"
                          style={{ border: "none" }}
                        />
                        <label
                          htmlFor="firstName"
                          style={{ right: 0, left: "auto" }}
                        >
                          שם פרטי
                        </label>
                      </div>
                      <div className="form-floating mb-3 text-end">
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          dir="rtl"
                          style={{ border: "none" }}
                        />
                        <label
                          htmlFor="lastName"
                          style={{ right: 0, left: "auto" }}
                        >
                          שם משפחה
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item">
                    <div className="form-floating mb-3 text-end">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ border: "none" }}
                      />
                      <label htmlFor="email" style={{ right: 0, left: "auto" }}>
                        כתובת מייל
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mt-3" dir="rtl">
                  <div className="col">
                    <button type="submit" className="btn btn-primary btn-block">
                      עדכון פרטים
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseTwo"
            >
              ההרשאות שלי
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseTwo"
            class="accordion-collapse collapse"
          >
            <div class="accordion-body">
              <p className="mb-1">{displayRoles(formData.roles)}</p>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseThree"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseThree"
            >
              פעולות נוספות
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseThree"
            class="accordion-collapse collapse"
          >
            <div class="accordion-body">
              <div className="row mb-3" dir="rtl">
                <div className="col">
                  <a href={`/change-password`}>
                    <button className="btn btn-secondary">החלפת סיסמא</button>
                  </a>
                </div>
                <div className="col">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="btn btn-danger"
                  >
                    מחיקת החשבון
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
