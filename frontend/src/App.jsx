import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import AddExpense from "./components/Addexpense";
import Table from "./components/Table";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MyCalendar from "./components/MyCalendar";
import Login from "./components/login";
import { useAuth } from "./hooks/useAuth";
import { useExpenses } from "./hooks/useExpenses";
import DelayedMessage from "./components/DelayMessage";
import "./App.css";

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { data, error, loading, onDelete, onAdd, onUpdateExpense } =
    useExpenses(isAuthenticated);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

  const getFilteredExpenses = () => {
    const now = new Date();

    return data.filter((expense) => {
      const expenseDate = new Date(expense.data);

      if (dateRange?.[0] && dateRange?.[1]) {
        const start = new Date(Math.min(dateRange[0], dateRange[1]));
        const end = new Date(Math.max(dateRange[0], dateRange[1]));

        return expenseDate >= start && expenseDate <= end;
      }

      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const totalAmount = data?.length
    ? getFilteredExpenses().reduce((sum, e) => {
        return sum + parseFloat(e.importo || 0);
      }, 0)
    : 0;

  const handleEdit = (expense) => {
    setExpenseToEdit(expense);
    setIsAddingExpense(true);
  };

  const handleLogin = () => {
    localStorage.setItem("authToken", "sample-token");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen w-full">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <>
                <Navbar onLogout={handleLogout} />
                <main className="p-4">
                  <div className="mb-4">
                    <MyCalendar
                      toggleAddExpense={() =>
                        setIsAddingExpense(!isAddingExpense)
                      }
                      dateRange={dateRange}
                      setDateRange={setDateRange}
                      totalAmount={totalAmount}
                    />
                  </div>

                  <div className="mt-20 text-center">
                    {dateRange[0] && dateRange[1] && (
                      <p>
                        {dateRange[0].getTime() === dateRange[1].getTime() ? (
                          <span className="text-black">
                            Data selezionata:{" "}
                            {dateRange[0].toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="bg-blue-500 p-2 w-[30%] text-xs rounded-lg">
                            Intervallo selezionato:{" "}
                            {dateRange[0].toLocaleDateString()} -{" "}
                            {dateRange[1].toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  {error && <div className="text-red-500">Errore: {error}</div>}

                  {isAddingExpense ? (
                    <AddExpense
                      onAddExpense={onAdd}
                      onUpdateExpense={onUpdateExpense}
                      expenseToUpdate={expenseToEdit}
                      onCancel={() => setIsAddingExpense(false)}
                      toggleAddExpense={() => {
                        setExpenseToEdit(null);
                        setIsAddingExpense(!isAddingExpense);
                      }}
                    />
                  ) : !loading && !error && filteredExpenses.length > 0 ? (
                    <Table
                      data={filteredExpenses}
                      onDelete={onDelete}
                      loading={loading}
                      error={error}
                      isOpen={!isAddingExpense}
                      onEdit={handleEdit}
                      dateRange={dateRange}
                    />
                  ) : (
                    <DelayedMessage
                      show={
                        !loading &&
                        !error &&
                        filteredExpenses.length === 0 &&
                        !isAddingExpense
                      }
                    >
                      <div className="text-center bg-blue-500 text-red-500 p-2 mt-20 w-min mx-auto text-xs rounded-lg">
                        Nessuna spesa trovata in quest'intervallo
                      </div>
                    </DelayedMessage>
                  )}
                </main>
                <div className="flex justify-center items-end mt-4">
                  <Footer />
                </div>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
