import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Logout = ({ setUserRoles, setUserName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(`בטוחים שברצונכם לצאת מהחשבון?`);

    if (confirmLogout) {
      // Remove the token and role from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      localStorage.removeItem("name");

      // Update the state to reflect that no user is logged in
      setUserRoles([]);
      setUserName("");

      // Redirect to login page

      window.location.reload();
    }
  };

  return (
    <button
      type="button"
      class="btn btn-link link-hover"
      style={{ textAlign: "center", textDecoration: "none", color: "red" }}
      onClick={handleLogout}
    >
      התנתקות <FiLogOut />
    </button>
  );
};

export default Logout;
