import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditCandidate = ({ userRoles }) => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [dogs, setDogs] = useState([]);
  const navigate = useNavigate();

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/candidates/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/login");
      }

      if (response.ok) {
        setCandidate(data);
        setFormData(data); // Set the form data with the current candidate data
      } else {
        console.error("Error fetching candidate:", data.message);
      }
    };

    fetchCandidate();
  }, [id]);

  // Fetch users for interviewer selection
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  // Fetch available dogs for wanted dog selection
  useEffect(() => {
    const fetchDogs = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/dogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDogs(data);
    };

    fetchDogs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/candidates/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      navigate("/login");
    }

    if (response.ok) {
      alert("הראיון עודכן בהצלחה");
      navigate("/view-candidates");
    } else {
      alert("Failed to update candidate.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("בטוח שברצונך למחוק את הראיון?");

    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/candidates/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          navigate("/login");
        }

        if (response.ok) {
          alert("הראיון נמחק בהצלחה");
          navigate("/view-candidates");
        } else {
          alert("Failed to delete candidate.");
        }
      } catch (error) {
        console.error("Error deleting candidate:", error);
        alert("Error occurred while deleting the candidate.");
      }
    }
  };

  if (!candidate) return <p>טוען פרטי ראיון</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <div className="mx-auto">
        <h2 className="text-center mb-4">עריכת ראיון</h2>
        <form onSubmit={handleSubmit}>
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
              <label
                htmlFor="interviewer"
                className="form-label text-end w-100"
              >
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
              עדכון הראיון
            </button>
          </div>
        </form>
        <div className="row mt-3" dir="rtl">
          <div className="col">
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(candidate.id)}
            >
              מחק ראיון
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCandidate;
