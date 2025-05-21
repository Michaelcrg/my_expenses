import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectCategory from "./SelectCategory";

const AddExpense = ({
  onAddExpense,
  toggleAddExpense,
  expenseToUpdate,
  onUpdateExpense,
}) => {
  const [expense, setExpense] = useState({
    data: "",
    descrizione: "",
    importo: "",
    categoria: null,
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isProd = import.meta.env.MODE === "production";

  const ENDPOINT = isProd
    ? import.meta.env.VITE_API_GET_CATEGORIES_URL
    : import.meta.env.VITE_API_GET_CATEGORIES_PROXY;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(ENDPOINT, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setCategories(data);
        setError(null);
      } catch (error) {
        console.error("Errore nel fetch delle categorie:", error);
        setError("Errore nel fetch delle categorie");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (expenseToUpdate && categories.length) {
      const found = categories.find(
        (c) => String(c.id) === String(expenseToUpdate.categoria)
      );

      const selectedCategory = found
        ? { value: found.id, label: found.nome }
        : null;

      setExpense({
        data: expenseToUpdate.data,
        descrizione: expenseToUpdate.descrizione,
        importo: expenseToUpdate.importo,
        categoria: selectedCategory,
      });
    }
  }, [expenseToUpdate, categories]);

  const handleCategoryChange = (selectedOption) => {
    setExpense((prev) => ({
      ...prev,
      categoria: selectedOption,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !expense.data ||
      !expense.importo ||
      !expense.descrizione ||
      !expense.categoria
    ) {
      alert("Compila tutti i campi!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.user_id;

    if (!userId) {
      alert("ID utente non trovato!");
      return;
    }

    const payload = {
      ...expense,
      categoria: expense.categoria.value,
      user_id: userId,
      id: expenseToUpdate ? expenseToUpdate.id : null,
    };

    try {
      if (expenseToUpdate) {
        await onUpdateExpense(expenseToUpdate.id, payload);
      } else {
        await onAddExpense(payload);
      }

      setExpense({ data: "", descrizione: "", importo: "", categoria: null });
      toggleAddExpense();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError("Errore durante l'operazione.");
      console.error(error);
    }
  };

  const handleExit = () => {
    toggleAddExpense();
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="border max-w-[800px] h-[80%] p-5 bg-[var(--custom-background)] rounded-xl border-blue-500 flex flex-col gap-4 w-[80%]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full"
        >
          <div className="flex flex-col w-full mb-4">
            <label>Data:</label>
            <input
              className="border border-white rounded-lg"
              type="date"
              name="data"
              value={expense.data}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col w-full mb-4">
            <label>Importo:</label>
            <input
              className="border border-white rounded-lg"
              type="number"
              name="importo"
              value={expense.importo}
              onChange={handleChange}
              placeholder="€"
            />
          </div>

          <div className="flex flex-col w-full mb-4">
            <label>Descrizione:</label>
            <input
              className="border border-white rounded-lg"
              type="text"
              name="descrizione"
              value={expense.descrizione}
              onChange={handleChange}
              maxLength={80}
              required
            />
          </div>

          <div className="flex flex-col w-full mb-4">
            <label>Categoria:</label>
            <SelectCategory
              categories={categories}
              selectedCategory={expense.categoria || null}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="flex justify-center w-full">
            <button
              className="bg-blue-800 border rounded-xl p-1 border-yellow-500"
              type="submit"
            >
              {expenseToUpdate ? "Aggiorna Spesa" : "Aggiungi Spesa"}
            </button>
          </div>
        </form>

        <div className="flex justify-center w-full">
          <button
            onClick={handleExit}
            className="bg-red-400 border rounded-xl p-1 border-yellow-500"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
