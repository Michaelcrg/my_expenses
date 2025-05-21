import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") {
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  return { isAuthenticated, setIsAuthenticated };
}
