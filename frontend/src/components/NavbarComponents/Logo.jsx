import React from "react";
import myExpensesLogo from "../../assets/myexpenses.svg";

function Logo() {
  return (
    <div className="flex items-center justify-center">
      <img src={myExpensesLogo} alt="MyExpenses Logo" className="h-10" />
    </div>
  );
}

export default Logo;
