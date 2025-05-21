import { useState, useEffect } from "react";
import useApiHeaders from "./useApiHeaders";

export function useExpenses(isAuthenticated) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { headers, isReady } = useApiHeaders();

  const getExpenses = async () => {
    if (!isReady || !isAuthenticated) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.user_id;
      if (!userId) throw new Error("User ID not found.");

      const isProd = import.meta.env.MODE === "production";

      const ENDPOINT = isProd
        ? import.meta.env.VITE_API_GET_EXPENSES_URL
        : import.meta.env.VITE_API_GET_EXPENSES_PROXY;

      const url = `${ENDPOINT}?user_id=${encodeURIComponent(userId)}`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error(result.error || "Invalid data structure");
      }

      setData(result.data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExpenses();
  }, [isReady, isAuthenticated]);

  const onAdd = async (newExpense) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.user_id;
      if (!userId) throw new Error("User ID not found.");

      const isProd = import.meta.env.MODE === "production";

      const ENDPOINT = isProd
        ? import.meta.env.VITE_API_ADD_EXPENSES_URL
        : import.meta.env.VITE_API_ADD_EXPENSES_PROXY;

      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify({ ...newExpense, user_id: userId }),
        redirect: "manual",
      });

      const text = await response.text();

      try {
        const result = JSON.parse(text);

        if (!response.ok) {
          throw new Error(result.error || "Generic error");
        }

        if (!result.success)
          throw new Error(result?.error || "Error during addition");

        await getExpenses();
      } catch (e) {
        console.error("Response not in JSON format:", text);
        throw new Error("Server response is not in JSON format");
      }
    } catch (error) {
      console.error("Error during addition:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const onDelete = async (expenseId) => {
    try {
      const isProd = import.meta.env.MODE === "production";

      const ENDPOINT = isProd
        ? import.meta.env.VITE_API_DELETE_EXPENSES_URL
        : import.meta.env.VITE_API_DELETE_EXPENSES_PROXY;

      const url = `${ENDPOINT}?id=${encodeURIComponent(expenseId)}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify({ id: expenseId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generic error");
      }

      setData((prev) => prev.filter((expense) => expense.id !== expenseId));
    } catch (error) {
      console.error("Deletion error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const onUpdateExpense = async (id, updatedExpense) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.user_id;
      if (!userId) throw new Error("User ID not found.");

      const isProd = import.meta.env.MODE === "production";

      const ENDPOINT = isProd
        ? import.meta.env.VITE_API_UPDATE_EXPENSES_URL
        : import.meta.env.VITE_API_UPDATE_EXPENSES_PROXY;

      const url = `${ENDPOINT}?id=${encodeURIComponent(id)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedExpense, user_id: userId, id }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "HTTP error");
      }

      const result = JSON.parse(responseText);

      if (!result.success) throw new Error("Error during update");

      await getExpenses();
    } catch (error) {
      console.error("Update error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return {
    data,
    error,
    loading,
    onAdd,
    onDelete,
    onUpdateExpense,
    fetchExpenses: getExpenses,
  };
}
