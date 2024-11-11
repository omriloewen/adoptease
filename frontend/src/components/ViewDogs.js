import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // For icons
import PostCarousel from "./PostCarousel";

const ViewDogs = ({ userRoles }) => {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  useEffect(() => {
    const fetchDogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await fetch("http://localhost:5000/api/dogs", {
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

      if (response.status === 403) {
        console.error(
          "Access denied: You do not have permission to view the dogs."
        );
        return;
      }

      const data = await response.json();
      setDogs(data);
    };

    fetchDogs();
  }, [navigate]);

  // Filter dogs based on search input and availability status
  const filteredDogs = dogs.filter(
    (dog) =>
      dog.name.toLowerCase().includes(searchInput.toLowerCase()) &&
      (!showOnlyAvailable || dog.status === "available")
  );

  return (
    <div className="container mt-4 justify-content-center">
      {/* Search Bar and Availability Switch */}
      <div className="grid mb-3" dir="rtl">
        <div className="row justify-content-center mb-3">
          <div className="col-6">
            <input
              type="text"
              className="form-control"
              placeholder="חפש כלב..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="col-6">
            <a
              href={
                userRoles.some((role) => ["manager", "md", "ad"].includes(role))
                  ? `/add-dog`
                  : "#"
              }
              disabled={
                !userRoles.some((role) =>
                  ["manager", "md", "ad"].includes(role)
                )
              }
            >
              <button
                className={`btn btn-primary ${
                  !userRoles.some((role) =>
                    ["manager", , "md", "ad"].includes(role)
                  )
                    ? "disabled"
                    : ""
                }`}
              >
                כלב חדש <i className="bi bi-plus"></i>
              </button>
            </a>
          </div>
        </div>
        <div className="row ">
          <div className="col d-flex flex-column gap-2 align-items-start">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="availableSwitch"
                checked={showOnlyAvailable}
                onChange={() => setShowOnlyAvailable(!showOnlyAvailable)}
              />
              <label className="form-check-label" htmlFor="availableSwitch">
                הצג כלבים זמינים בלבד
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Dog Cards Gallery */}
      <div className="row g-3 scrollable-container">
        {filteredDogs.length > 0 ? (
          filteredDogs.map((dog) => (
            <div key={dog.id} className="col-md-4">
              <div className="card h-100" dir="rtl">
                <PostCarousel
                  images={JSON.parse(dog.image_urls)}
                  carouselId={`carousel-${dog.id}`}
                />
                <div className="card-body">
                  <h5 className="card-title">{dog.name}</h5>
                  <p className="card-text">גזע: {dog.breed}</p>
                  <p className="card-text">סטטוס: {dog.status}</p>
                </div>
                <div className="card-footer">
                  <Link
                    to={
                      userRoles.some((role) => ["manager", "md"].includes(role))
                        ? `/edit-dog/${dog.id}`
                        : "#"
                    }
                    className={`btn ${
                      userRoles.some((role) => ["manager", "md"].includes(role))
                        ? "btn-primary"
                        : "btn-secondary"
                    }`}
                    disabled={
                      !userRoles.some((role) =>
                        ["manager", "md"].includes(role)
                      )
                    }
                  >
                    <i className="bi bi-pencil"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="row justify-content-center mt-5" dir="rtl">
            <div className="col-md-6" dir="rtl">
              <h5 className="text-center">
                אין כלבים להצגה, כנראה בגלל אחת או יותר מהסיבות הבאות:
              </h5>

              <ul className="list-group list-group-flush text-end" dir="rtl">
                <li className="list-group-item" dir="rtl">
                  אין כלבים מתאימים לסינונים או החיפושים שהוגדרו
                </li>
                <li className="list-group-item" dir="rtl">
                  אין לך הרשאות לצפייה בכלבים, אפשר לבקש הרשאות ממנהל
                </li>
                <li className="list-group-item" dir="rtl">
                  תקלת תקשורת, אפשר לנסות לטעון מחדש או לדווח ולחכות שהתקלה
                  תתוקן
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDogs;
