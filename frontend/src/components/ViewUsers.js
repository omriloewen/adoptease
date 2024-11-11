import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ViewUsers = ({ userRoles }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
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
      setUsers(data);
    };

    fetchUsers();
  }, [navigate]);

  // Function to display user roles
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
      <h2 className="text-center mb-4">ניהול משתמשים </h2>
      <div className="list-group" dir="rtl">
        {users.map((user) => (
          <a
            href={`/edit-user/${user.id}`}
            className={`list-group-item list-group-item-action ${
              !userRoles.some((role) => ["manager"].includes(role)) ||
              user.roles.includes("manager")
                ? "disabled"
                : ""
            }`}
            aria-current="true"
            key={user.id}
          >
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">
                {user.firstName} {user.lastName}{" "}
              </h5>
              <small>{user.email}</small>
            </div>
            <p className="mb-1">{displayRoles(user.roles)}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ViewUsers;
