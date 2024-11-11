import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ViewCandidates.css";
import ColorPickerButton from "./ColorPickerButton";

const ViewCandidates = ({ userRoles }) => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [wantedDogFilter, setWantedDogFilter] = useState("");
  const [showOnlyToday, setShowOnlyToday] = useState(true);
  const [showOnlyAvailableDogs, setShowOnlyAvailableDogs] = useState(true);
  const [availableDogs, setAvailableDogs] = useState([]);
  const [showColorMarks, setShowColorMarks] = useState(true); // New state for showing/hiding color marks

  // Fetch candidates and available dogs
  useEffect(() => {
    const fetchCandidates = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/candidates", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setCandidates(Array.isArray(data) ? data : []); // Ensure `candidates` is always an array
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setCandidates([]); // Fall back to an empty array on error
      }
    };

    const fetchAvailableDogs = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/dogs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401 || response.status === 403) {
          setAvailableDogs([]); // Set to empty array if unauthorized

          return;
        }

        const data = await response.json();
        setAvailableDogs(
          Array.isArray(data)
            ? data.filter(
                (dog) => !showOnlyAvailableDogs || dog.status === "available"
              )
            : []
        ); // Ensure availableDogs is always an array
      } catch (error) {
        console.error("Error fetching dogs:", error);
        setAvailableDogs([]); // Set to empty array on error
      }
    };

    fetchCandidates();
    fetchAvailableDogs();
  }, [navigate, showOnlyAvailableDogs]);

  // Handle delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("בטוח שברצונך למחוק את הראיון?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/candidates/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("roles");
          localStorage.removeItem("name");
          navigate("/login");
        }

        if (response.ok) {
          setCandidates((prevCandidates) =>
            prevCandidates.filter((candidate) => candidate.id !== id)
          );
          alert("הראיון נמחק בהצלחה");
        } else {
          alert("Failed to delete candidate.");
        }
      } catch (error) {
        console.error("Error deleting candidate:", error);
        alert("Error occurred while deleting the candidate.");
      }
    }
  };

  // Handle coloring
  const handleColoring = async (color, id) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) =>
        candidate.id === id ? { ...candidate, colorMark: color } : candidate
      )
    );

    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5000/api/candidates/${id}/colorMark`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ colorMark: color }),
      }
    );

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      navigate("/login");
    }

    if (!response.ok) {
      alert("Failed to update candidate color.");
    }
  };

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // Step 1: Filter candidates by today's date
  const filteredByDateCandidates = useMemo(() => {
    if (showOnlyToday) {
      return candidates.filter(
        (candidate) =>
          new Date(candidate.date).toISOString().split("T")[0] === today
      );
    }
    return candidates;
  }, [candidates, showOnlyToday, today]);

  // Step 2: Apply the wanted dog filter
  const filteredCandidates = useMemo(() => {
    if (wantedDogFilter) {
      return filteredByDateCandidates.filter((candidate) =>
        candidate.wantedDog
          ?.toLowerCase()
          .includes(wantedDogFilter.toLowerCase())
      );
    }
    return filteredByDateCandidates;
  }, [filteredByDateCandidates, wantedDogFilter]);

  // Define table columns
  const columns = useMemo(
    () => [
      { Header: "שם", accessor: "name" },
      { Header: "כלב", accessor: "wantedDog" },
      { Header: "מראיין", accessor: "interviewer" },
      { Header: <i className="bi bi-star-fill"></i>, accessor: "score" },
      {
        Header: <i className="bi bi-telephone"></i>,
        accessor: "phoneNumber",
        Cell: ({ value }) => <a href={`tel:${value}`}>{value}</a>,
      },
      {
        Header: <i className="bi bi-calendar"></i>,
        accessor: "date",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      { Header: "", accessor: "colorMark", show: false },
      {
        Header: <i className="bi bi-eye"></i>,
        accessor: "id",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center align-items-center">
            <div className="me-2">
              <ColorPickerButton row={row} handleColoring={handleColoring} />
            </div>

            {/* Edit/Delete Buttons */}
            {userRoles.some((role) => ["manager", "mc"].includes(role)) && (
              <>
                <div className="me-2">
                  <Link to={`/edit-candidate/${row.values.id}`}>
                    <button className="btn btn-primary">
                      <i className="bi bi-pencil"></i>
                    </button>
                  </Link>
                </div>
                <div className="me-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(row.values.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        ),
      },
    ],
    [userRoles]
  );

  // Set up table instance with global and sorting filters
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    { columns, data: filteredCandidates },
    useGlobalFilter,
    useSortBy
  );

  useEffect(() => {
    setGlobalFilter(searchInput || undefined);
  }, [searchInput, setGlobalFilter]);

  return (
    <div className="container mt-4">
      <div className="row" dir="rtl">
        <div className="col">
          <h2 className="mb-4" dir="rtl">
            ראיונות
          </h2>
        </div>
        <div className="col text-center">
          <a
            href={
              userRoles.some((role) => ["manager", "mc", "ac"].includes(role))
                ? `/add-candidate`
                : "#"
            }
            disabled={
              !userRoles.some((role) => ["manager", "mc", "ac"].includes(role))
            }
          >
            <button
              className={`btn btn-primary ${
                !userRoles.some((role) =>
                  ["manager", "ac", "mc"].includes(role)
                )
                  ? "disabled"
                  : ""
              }`}
            >
              ראיון חדש <i className="bi bi-plus"></i>
            </button>
          </a>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col d-flex flex-column gap-2 align-items-center">
          {/* Toggle for today's candidates */}
          <div className="form-check form-switch" dir="rtl">
            <input
              type="checkbox"
              className="form-check-input"
              id="showToday"
              checked={showOnlyToday}
              onChange={() => setShowOnlyToday(!showOnlyToday)}
            />
            <label className="form-check-label" htmlFor="showToday">
              ראיונות מהיום
            </label>
          </div>

          {/* Toggle for available dogs */}
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="showAvailableDogs"
              checked={showOnlyAvailableDogs}
              onChange={() => setShowOnlyAvailableDogs(!showOnlyAvailableDogs)}
            />
            <label className="form-check-label" htmlFor="showAvailableDogs">
              כלבים זמינים
            </label>
          </div>

          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="showColorMarks"
              checked={showColorMarks}
              onChange={() => setShowColorMarks(!showColorMarks)}
            />
            <label className="form-check-label" htmlFor="showColorMarks">
              הצג סימני צבע
            </label>
          </div>
        </div>
        <div className="col">
          {/* Filter dropdown for wanted dogs */}
          <select
            className="form-select mb-3"
            value={wantedDogFilter}
            onChange={(e) => setWantedDogFilter(e.target.value)}
            dir="rtl"
          >
            <option value="">בחר כלב</option>
            {availableDogs.map((dog) => (
              <option key={dog.id} value={dog.name}>
                {dog.name}
              </option>
            ))}
          </select>

          {/* Search input for global filtering */}
          <input
            type="text"
            className="form-control "
            placeholder="חפש..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            dir="rtl"
          />
        </div>
      </div>
      <div class="table-responsive" dir="rtl">
        {filteredCandidates.length > 0 ? (
          <table
            {...getTableProps()}
            className="table table-striped table-bordered table-sm"
            dir="rtl"
            style={{ whiteSpace: "nowrap" }}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{ padding: "10px" }}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <i className="bi bi-sort-down"></i>
                          ) : (
                            <i className="bi bi-sort-up"></i>
                          )
                        ) : (
                          <i className="bi bi-arrow-down-up"></i>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    style={{
                      "--bs-table-bg": showColorMarks
                        ? row.values.colorMark || "inherit"
                        : "inherit",
                    }}
                    className={`table-row ${
                      index % 2 === 0 ? "table-striped" : ""
                    }`}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="row justify-content-center mt-5" dir="rtl">
            <div className="col-md-6">
              <h5 className="text-center">
                אין ראיונות להצגה, כנראה בגלל אחת או יותר מהסיבות הבאות:
              </h5>

              <ul className="list-group list-group-flush" dir="rtl">
                <li className="list-group-item">
                  אין ראיונות מתאימים לסינונים או החיפושים שהוגדרו
                </li>
                <li className="list-group-item">
                  אין לך הרשאות לצפייה בראיונות, אפשר לבקש הרשאות ממנהל
                </li>
                <li className="list-group-item">
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

export default ViewCandidates;
