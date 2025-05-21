import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import calendar from "../assets/calendar.svg";
import removeCalendar from "../assets/removeCalendar.svg";
import MonthlyTotal from "./MonthlyTotal";
import AddButton from "./AddButton";
import { it } from "date-fns/locale";

function MyCalendar({
  toggleAddExpense,
  dateRange,
  setDateRange,
  totalAmount,
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleChange = (newValue) => {
    if (Array.isArray(newValue)) {
      setDateRange(newValue);
      if (newValue[0] && newValue[1]) {
        setShowCalendar(false);
      }
    } else {
      setDateRange([newValue, newValue]);
      setShowCalendar(false);
    }
  };

  return (
    <>
      <div className="fixed flex h-6 justify-evenly items-center rounded-full left-1/2 -translate-x-1/2 top-16 w-4/5 max-w-[800px] bg-blue-800 shadow-lg z-50">
        <button
          className="bg-[var(--custom-background)] table-custom rounded px-1 h-max"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? (
            <img src={removeCalendar} alt="icon" />
          ) : (
            <img src={calendar} alt="icon" />
          )}
        </button>

        <AddButton onClick={toggleAddExpense} />
        <MonthlyTotal total={totalAmount.toFixed(2)} />
      </div>

      {showCalendar && (
        <div className="fixed top-24 left-0 flex justify-center items-center">
          <div className="w-screen flex justify-center items-center shadow-md rounded z-1">
            <Calendar
              view="month"
              showNavigation={true}
              selectRange={true}
              className="my-calendar"
              onChange={handleChange}
              locale={it}
            />
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        {dateRange[0] && dateRange[1] && (
          <p>
            {dateRange[0].getTime() === dateRange[1].getTime() ? (
              <span className="text-black">
                Data selezionata: {formatDate(dateRange[0])}
              </span>
            ) : (
              <span className="bg-red-500">
                Intervallo selezionato: {formatDate(dateRange[0])} -{" "}
                {formatDate(dateRange[1])}
              </span>
            )}
          </p>
        )}
      </div>
    </>
  );
}

function formatDate(date) {
  return date.toLocaleDateString("it-IT");
}

export default MyCalendar;
