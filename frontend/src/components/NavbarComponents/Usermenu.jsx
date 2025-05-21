import hamburger from "../../assets/hamburger.svg";
import { useAuth } from "../../hooks/useAuth";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Usermenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  const getUserData = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return "Utente";

    const user = JSON.parse(userStr);
    if (user && user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    return "Utente";
  };

  const getUserInitials = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    return "";
  };

  const userInitials = getUserInitials();
  const userName = getUserData();

  const handleLogout = async () => {
    const API_URL = import.meta.env.VITE_API_LOGOUT_URL;

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Errore nel logout");
      }

      localStorage.clear();

      navigate("/login");
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  return (
    <div className="relative z-10">
      <button
        className="text-white relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={hamburger} alt="icon" />
      </button>

      <ul
        className={`space-x-6 ${
          isOpen ? "block" : "hidden"
        } absolute top-19.5 right-1 w-36 h-24  bg-blue-800 rounded-sm gap-1 z-60`}
      >
        <li className="flex items-center justify-center">
          <div
            className=" size-8 flex
          items-center justify-center rounded-full bg-black ml-5 flex-row text-white font-bold"
          >
            {userInitials}
          </div>
          <p className="ml-5">{userName}</p>
        </li>

        <li className="flex items-center justify-center mb-1 mt-1">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Usermenu;
