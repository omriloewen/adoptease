import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EditUser = ({ userRoles }) => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
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
        setUser(data);
        setRoles(data.roles);
      } else {
        console.error("Error fetching user:", data.message);
      }
    };

    fetchUser();
  }, [id]);

  const handleCandidatesRoleChange = (e) => {
    const option = e.target.value;
    // For managing candidates (mc), auto-select and disable 'ac' and 'vc'
    if (option === "mc") {
      setRoles([
        ...new Set([...roles.filter((r) => !["ac", "vc"].includes(r)), "mc"]),
      ]);
    }

    // For managing dogs (md), auto-select and disable 'ad' and 'vd'
    else if (option === "ac") {
      setRoles([
        ...new Set([...roles.filter((r) => !["mc", "vc"].includes(r)), "ac"]),
      ]);
    } else if (option === "vc") {
      setRoles([
        ...new Set([...roles.filter((r) => !["mc", "ac"].includes(r)), "vc"]),
      ]);
    } else if (option === "ac,vc") {
      setRoles([
        ...new Set([...roles.filter((r) => !["mc"].includes(r)), "ac", "vc"]),
      ]);
    } else if (option === "") {
      setRoles([
        ...new Set([...roles.filter((r) => !["mc", "vc", "ac"].includes(r))]),
      ]);
    }
  };

  const handleDogsRoleChange = (e) => {
    const option = e.target.value;
    // For managing candidates (mc), auto-select and disable 'ac' and 'vc'
    if (option === "md") {
      setRoles([
        ...new Set([...roles.filter((r) => !["ad", "vd"].includes(r)), "md"]),
      ]);
    }

    // For managing dogs (md), auto-select and disable 'ad' and 'vd'
    else if (option === "ad") {
      setRoles([
        ...new Set([...roles.filter((r) => !["md", "vd"].includes(r)), "ad"]),
      ]);
    } else if (option === "vd") {
      setRoles([
        ...new Set([...roles.filter((r) => !["md", "ad"].includes(r)), "vd"]),
      ]);
    } else if (option === "ad,vd") {
      setRoles([
        ...new Set([...roles.filter((r) => !["md"].includes(r)), "ad", "vd"]),
      ]);
    } else if (option === "") {
      setRoles([
        ...new Set([...roles.filter((r) => !["md", "vd", "ad"].includes(r))]),
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let ok = true;

    if (roles.includes("manager")) {
      ok = window.confirm(
        `אתם עומדים להגדיר את ${user.firstName} ${user.lastName} כמנהל, בטוחים שברצונכם לעשות זאת?`
      );
    }
    if (ok) {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/users/${id}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ roles }), // Send the updated roles array
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("name");
        navigate("/login");
      }

      if (response.ok) {
        alert(`הרשאות עבור ${user.firstName} ${user.lastName} עודכנו בהצלחה`);
        navigate("/view-users");
      } else {
        alert("Failed to update user role.");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      `בטוח שברצונך למחוק את המשתמש ${user.firstName} ${user.lastName}?`
    );

    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("roles");
          localStorage.removeItem("name");
          navigate("/login");
        }

        if (response.ok) {
          alert(`המשתמש ${user.firstName} ${user.lastName} נמחק בהצלחה`);
          navigate("/view-users");
        } else {
          alert("Failed to delete user.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error occurred while deleting the user.");
      }
    }
  };

  const handleManagerSet = () => {
    if (roles.includes("manager")) {
      setRoles(roles.filter((r) => !(r === "manager")));
    } else {
      setRoles([...new Set([...roles, "manager"])]);
    }
  };

  /* const handleManagerToggle = () => {
    if (window.confirm("האם אתה בטוח שברצונך להגדיר משתמש זה כמנהל?")) {
      handleRoleChange("manager");
    }
  }; */

  if (!user) return <p>טוען פרטי משתמש...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h5 className="text-center mb-4">
        ניהול משתמשים עבור {user.firstName} {user.lastName}
      </h5>
      <div class="accordion" id="accordionPanelsStayOpenExample" dir="rtl">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              הרשאות
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            class="accordion-collapse collapse show"
          >
            <div class="accordion-body" dir="ltr">
              <form onSubmit={handleSubmit}>
                <div class="input-group mb-3">
                  <select
                    class="form-select"
                    disabled={roles.includes("manager")}
                    id="inputGroupSelect01"
                    dir="rtl"
                    onChange={handleCandidatesRoleChange}
                  >
                    <option
                      selected={
                        !roles.includes("ac") &&
                        !roles.includes("vc") &&
                        !roles.includes("mc") &&
                        !roles.includes("manager")
                      }
                      value=""
                    >
                      אין הרשאות
                    </option>
                    <option
                      selected={
                        roles.includes("ac") &&
                        !roles.includes("vc") &&
                        !roles.includes("mc") &&
                        !roles.includes("manager")
                      }
                      value="ac"
                    >
                      הוספת ראיונות בלבד
                    </option>
                    <option
                      selected={
                        roles.includes("vc") &&
                        !roles.includes("ac") &&
                        !roles.includes("mc") &&
                        !roles.includes("manager")
                      }
                      value="vc"
                    >
                      צפייה בראיונות בלבד
                    </option>
                    <option
                      selected={
                        roles.includes("vc") &&
                        roles.includes("ac") &&
                        !roles.includes("mc") &&
                        !roles.includes("manager")
                      }
                      value="ac,vc"
                    >
                      הוספה וצפייה בראיונות
                    </option>
                    <option
                      selected={
                        roles.includes("mc") || roles.includes("manager")
                      }
                      value="mc"
                    >
                      ניהול ראיונת
                    </option>
                  </select>
                  <label class="input-group-text" for="inputGroupSelect01">
                    ראיונות
                  </label>
                </div>

                <div class="input-group mb-3">
                  <select
                    class="form-select"
                    disabled={roles.includes("manager")}
                    id="inputGroupSelect01"
                    dir="rtl"
                    onChange={handleDogsRoleChange}
                  >
                    <option
                      selected={
                        !roles.includes("ad") &&
                        !roles.includes("vd") &&
                        !roles.includes("md") &&
                        !roles.includes("manager")
                      }
                      value=""
                    >
                      אין הרשאות
                    </option>
                    <option
                      selected={
                        roles.includes("ad") &&
                        !roles.includes("vd") &&
                        !roles.includes("md") &&
                        !roles.includes("manager")
                      }
                      value="ad"
                    >
                      הוספת כלבים בלבד
                    </option>
                    <option
                      selected={
                        roles.includes("vd") &&
                        !roles.includes("ad") &&
                        !roles.includes("md") &&
                        !roles.includes("manager")
                      }
                      value="vd"
                    >
                      צפייה בכלבים בלבד
                    </option>
                    <option
                      selected={
                        roles.includes("vd") &&
                        roles.includes("ad") &&
                        !roles.includes("md") &&
                        !roles.includes("manager")
                      }
                      value="ad,vd"
                    >
                      הוספה וצפייה בכלבים
                    </option>
                    <option
                      selected={
                        roles.includes("md") || roles.includes("manager")
                      }
                      value="md"
                    >
                      ניהול כלבים
                    </option>
                  </select>
                  <label class="input-group-text" for="inputGroupSelect01">
                    כלבים
                  </label>
                </div>
                <div className="row mb-3" dir="rtl">
                  <div className="col-8" dir="ltr">
                    <div class="input-group justify-content-end">
                      <div class="input-group-text">
                        <input
                          class="form-check-input mt-0"
                          type="checkbox"
                          checked={roles.includes("manager")}
                          onChange={handleManagerSet}
                        />
                      </div>
                      <label class="input-group-text" for="inputGroupSelect01">
                        הגדר כמנהל
                      </label>
                    </div>
                  </div>
                  <div className="col-2">
                    <button type="submit" className="btn btn-primary btn-block">
                      עדכון
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
              פעולות נוספות
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseTwo"
            class="accordion-collapse collapse"
          >
            <div class="accordion-body">
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(user.id)}
              >
                מחק את {user.firstName} {user.lastName}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
