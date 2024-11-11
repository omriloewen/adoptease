import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AddCandidate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    wantedDog: "",
    interviewer: "",
    score: 0,
  });

  const [dogs, setDogs] = useState([]); // State to store available dogs
  const [users, setUsers] = useState([]); // State to store users

  useEffect(() => {
    // Fetch available dogs
    const fetchDogs = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/dogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/login");
      }
      if (response.ok) {
        setDogs(data.filter((dog) => dog.status === "available")); // Filter available dogs
      }
    };

    // Fetch users
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("name");
        navigate("/login");
      }
      if (response.ok) {
        setUsers(data);
        const loggedInUser = jwtDecode(token);
        setFormData((prev) => ({
          ...prev,
          interviewer: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
        }));
      }
    };

    fetchDogs();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/login");
      }
      if (response.ok) {
        alert("הראיון נוסף בהצלחה");
        navigate("/");
      } else {
        alert(data.error || "Error adding candidate");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="text-center mb-4">הוספת ראיון</h2>
      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="mb-3">
          <label htmlFor="name" className="form-label text-end w-100">
            שם
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
            dir="rtl"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label text-end w-100">
            טלפון
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            className="form-control"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            dir="rtl"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="wantedDog" className="form-label text-end w-100">
            מתראיין עבור
          </label>
          <select
            id="wantedDog"
            name="wantedDog"
            className="form-select"
            value={formData.wantedDog}
            onChange={handleChange}
            required
            dir="rtl"
          >
            <option value="">בחר כלב</option>
            {dogs.map((dog) => (
              <option key={dog.id} value={dog.name}>
                {dog.name}
              </option>
            ))}
          </select>
        </div>

        <div className="row mb-3">
          {/* Score field (25% width) */}
          <div className="col-md-3">
            <label htmlFor="score" className="form-label text-end w-100">
              ציון
            </label>
            <input
              type="number"
              id="score"
              name="score"
              min="0"
              max="10"
              step="0.5"
              className="form-control"
              value={formData.score}
              onChange={handleChange}
              required
              dir="rtl"
            />
          </div>

          {/* Interviewer field (75% width) */}
          <div className="col-md-9">
            <label htmlFor="interviewer" className="form-label text-end w-100">
              מראיין
            </label>
            <select
              id="interviewer"
              name="interviewer"
              className="form-select"
              value={formData.interviewer}
              onChange={handleChange}
              required
              dir="rtl"
            >
              {users.map((user) => (
                <option
                  key={user.id}
                  value={`${user.firstName} ${user.lastName}`}
                >
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            הזן ראיון
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCandidate;
