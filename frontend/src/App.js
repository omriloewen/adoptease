import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Logout from "./components/Logout";
import AddCandidate from "./components/AddCandidate";
import AddDog from "./components/AddDog";
import ViewCandidates from "./components/ViewCandidates";
import ViewUsers from "./components/ViewUsers";
import EditUser from "./components/EditUser";
import EditCandidate from "./components/EditCandidate";
import ViewDogs from "./components/ViewDogs";
import EditDog from "./components/EditDog";
import UserSettings from "./components/UserSettings";
import PasswordChange from "./components/PasswordChange";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import { Offcanvas, Button } from "react-bootstrap"; // Bootstrap's Offcanvas
import { FaRegUserCircle, FaPaw, FaHome } from "react-icons/fa"; // Import a small action icon (3 dots icon)
import { GiSittingDog } from "react-icons/gi";
import { MdManageAccounts } from "react-icons/md";
import { SiReaddotcv } from "react-icons/si";
import { jwtDecode } from "jwt-decode";
import "./custom-styles.css";
import HomePage from "./components/HomePage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import InstagramMedia from "./components/instaMedia";

const App = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [userName, setUserName] = useState("");
  const [showOffCanvas, setShowOffCanvas] = useState(false); // For toggling off-canvas

  useEffect(() => {
    // Check if there's a token in localStorage when the app loads
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the token and set the roles and user information
        const decodedToken = jwtDecode(token);

        // Check if the token has expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token has expired, remove it
          localStorage.removeItem("token");
          localStorage.removeItem("roles");
          localStorage.removeItem("name");
        } else {
          // Token is still valid, set user roles and name
          setUserRoles(decodedToken.roles);
          setUserName(`${decodedToken.firstName} ${decodedToken.lastName}`);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const toggleOffCanvas = () => setShowOffCanvas(!showOffCanvas);

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <div className="container-fluid">
            {/* Left: Login/Logout */}

            {/* Center: Logged in message */}
            <div className="navbar-text mx-auto">
              {userName ? `מחוברים : ${userName}` : "אין משתמשים מחוברים"}
            </div>

            <div className="navbar-nav ms-auto">
              <a href="/" className="nav-link">
                <FaHome
                  size={24}
                  className="icon-hover" // Size of the icon
                  style={{ cursor: "pointer" }}
                  // Toggle the off-canvas menu
                />
              </a>
            </div>

            {/* Right: Actions icon to toggle action buttons */}
            <div className="navbar-nav ms-auto">
              <FaPaw
                size={24}
                className="icon-hover" // Size of the icon
                style={{ cursor: "pointer" }}
                onClick={toggleOffCanvas} // Toggle the off-canvas menu
              />
            </div>
          </div>
        </nav>

        <Offcanvas
          show={showOffCanvas}
          onHide={toggleOffCanvas}
          placement="end"
          style={{ width: "250px" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="mx-auto">AdoptEase</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column">
            <div className="list-group list-group-flush">
              {/* Other Links */}
              <div className="list-group-item text-center">
                <a
                  href="/view-dogs"
                  style={{ color: "black", textDecoration: "none" }}
                  className={`icon-hover btn btn-link ${
                    !userRoles.some((role) => ["member"].includes(role))
                      ? "disabled"
                      : ""
                  }`}
                >
                  כלבים <GiSittingDog />
                </a>
              </div>
              <div className="list-group-item text-center">
                <a
                  href="/view-candidates"
                  style={{ color: "black", textDecoration: "none" }}
                  className={`icon-hover btn btn-link ${
                    !userRoles.some((role) => ["member"].includes(role))
                      ? "disabled"
                      : ""
                  }`}
                >
                  ראיונות <SiReaddotcv />
                </a>
              </div>
              <div className="list-group-item text-center">
                <a
                  href="/view-users"
                  style={{ color: "black", textDecoration: "none" }}
                  className={`icon-hover btn btn-link ${
                    !userRoles.some((role) => ["manager"].includes(role))
                      ? "disabled"
                      : ""
                  }`}
                >
                  ניהול משתמשים <MdManageAccounts />
                </a>
              </div>
              <div className="list-group-item text-center">
                <a
                  href="/settings"
                  className={`btn btn-link ${
                    !userRoles.some((role) => ["member"].includes(role))
                      ? "disabled"
                      : ""
                  }`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <FaRegUserCircle size={24} className="icon-hover" />
                </a>
              </div>
            </div>

            {/* Login, Signup, and Logout Links at the Bottom */}
            <div className="mt-auto text-center">
              {userName ? (
                <Logout setUserRoles={setUserRoles} setUserName={setUserName} />
              ) : (
                <>
                  <a
                    href="/login"
                    style={{ textDecoration: "none" }}
                    className="btn btn-link link-hover"
                  >
                    התחברות
                  </a>
                  <a
                    href="/signup"
                    style={{ textDecoration: "none" }}
                    className="btn btn-link link-hover"
                  >
                    הרשמה
                  </a>
                </>
              )}
            </div>
          </Offcanvas.Body>
        </Offcanvas>
        <div className="content-wrapper">
          <Routes>
            {/* Public Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/login"
              element={
                <Login setUserRoles={setUserRoles} setUserName={setUserName} />
              }
            />

            {/* Protected Routes */}
            <Route
              path="/add-candidate"
              element={
                <ProtectedRoute>
                  <AddCandidate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-dog"
              element={
                <ProtectedRoute>
                  <AddDog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-candidates"
              element={
                <ProtectedRoute>
                  <ViewCandidates userRoles={userRoles} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-users"
              element={
                <ProtectedRoute>
                  <ViewUsers userRoles={userRoles} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-user/:id"
              element={
                <ProtectedRoute>
                  <EditUser userRoles={userRoles} />
                </ProtectedRoute>
              }
            />
            <Route path="/instagram" element={<InstagramMedia />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/edit-candidate/:id"
              element={
                <ProtectedRoute>
                  <EditCandidate userRoles={userRoles} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-dogs"
              element={
                <ProtectedRoute>
                  <ViewDogs userRoles={userRoles} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-dog/:id"
              element={
                <ProtectedRoute>
                  <EditDog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <UserSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <PasswordChange />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
