import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          // If the token is invalid, clear localStorage and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("roles");
          localStorage.removeItem("name");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        navigate("/login");
      }
    };

    // Call the function to check token validity
    checkAuth();
  }, [navigate]);

  return children; // Render the protected component if the token is valid
};

export default ProtectedRoute;
