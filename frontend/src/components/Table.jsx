import { useState } from "react";

const Table = ({
  data,
  onEdit,
  onDelete,
  loading,
  error,
  isOpen,
  dateRange,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("it-IT", options);
  };

  const sortedData = () => {
    if (!data || !sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" className="text-center">
            Loading...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="6" className="text-center text-red-500 py-4">
            {error}
          </td>
        </tr>
      );
    }

    if (!data || data.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-4">
            No expenses found.
          </td>
        </tr>
      );
    }

    return sortedData()
      .filter((expense) => {
        if (!expense || !expense.data) return false;

        const expenseDate = new Date(expense.data);

        if (dateRange?.[0] && dateRange?.[1]) {
          const start = new Date(Math.min(dateRange[0], dateRange[1]));
          const end = new Date(Math.max(dateRange[0], dateRange[1]));
          return expenseDate >= start && expenseDate <= end;
        }

        const now = new Date();
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      })

      .map((expense, index) => [
        <tr
          key={`expense-row-${expense.id}`}
          className={`${
            Math.floor(index / 1) % 2 === 0
              ? "bg-[var(--custom-background)]"
              : "bg-teal-600"
          } hover:bg-gray-500 transition-colors `}
        >
          <td className="py-1 px-2 w-[25%] lg:w-[10%] rounded-tl-4xl lg:first:rounded-l-4xl">
            {expense && expense.data
              ? formatDate(expense.data)
              : "Date not available"}
          </td>
          <td className="py-1 font-medium whitespace-nowrap w-[25%] lg:w-[10%] text-center ">
            €
            {expense && expense.importo
              ? parseFloat(expense.importo).toFixed(2)
              : "0.00"}
          </td>
          <td className="hidden lg:table-cell py-1 text-center ">
            {expense && expense.categoria
              ? expense.categoria
              : "Category not available"}
          </td>
          <td
            className="hidden lg:table-cell py-1 text-center lg:last:rounded-l-4xl"
            title={
              expense && expense.descrizione
                ? expense.descrizione
                : "Description not available"
            }
          >
            {expense && expense.descrizione
              ? expense.descrizione
              : "Description not available"}
          </td>
          <td className="py-1 w-20 text-center">
            <button
              onClick={() => onEdit(expense)}
              className="hover:bg-blue-600 text-white px-2 py-1 rounded-lg transition-all"
              aria-label={`Edit expense ${expense.descrizione}`}
            >
              ✏️
            </button>
          </td>
          <td className="py-1 w-20 text-center px-2 rounded-tr-4xl lg:last:rounded-r-4xl">
            <button
              onClick={() => onDelete(expense.id)}
              className="hover:bg-red-600 text-white px-2 py-1 rounded-lg transition-all"
              aria-label={`Delete expense ${expense.descrizione}`}
            >
              🗑️
            </button>
          </td>
        </tr>,

        <tr
          key={`expense-details-${expense.id}`}
          className={`${
            Math.floor(index / 1) % 2 === 0
              ? "bg-[var(--custom-background)]"
              : "bg-teal-600"
          } hover:bg-gray-50 transition-colors lg:hidden`}
        >
          <td className="py-1 l-2 w-[10%] font-semibold text-center capitalize text-custom  text-blue-200 rounded-bl-4xl">
            {expense && expense.categoria
              ? expense.categoria
              : "Category not available"}
          </td>
          <td
            colSpan={3}
            className="py-1 text-center whitespace-normal max-w-[15em] px-2  break-words break-keep rounded-br-4xl"
            title={
              expense && expense.descrizione
                ? expense.descrizione
                : "Description not available"
            }
          >
            {expense && expense.descrizione
              ? expense.descrizione
              : "Description not available"}
          </td>
        </tr>,
      ]);
  };

  if (!isOpen) return null;

  return (
    <div className="rounded-lg w-[80%]  max-w-[800px] mx-auto flex items-start justify-center min-h-[400px]">
      <div className="mt-11">
        <table className="w-full md:text-base table-custom ">
          <thead>
            <tr className="hidden lg:table-row">
              {[
                "Date",
                "Amount",
                "Category",
                "Description",
                "Edit",
                "Delete",
              ].map((header, index, array) => (
                <th
                  key={header}
                  onClick={() => index < 4 && handleSort(header.toLowerCase())}
                >
                  <div
                    className={`bg-blue-800 text-sm flex items-center justify-center p-2 
                      ${index === 0 ? "rounded-l-2xl" : ""} 
                      ${index === array.length - 1 ? "rounded-r-2xl" : ""}`}
                  >
                    {header}
                    {sortConfig.key === header.toLowerCase() && (
                      <span className="ml-2">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
