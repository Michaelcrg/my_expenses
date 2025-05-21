import React from "react";

const Card = ({ children }) => {
  return (
    <div className="h-[66vh] w-[80%] md:w-[50%] border border-white bg-[var(--custom-background)] rounded-lg flex justify-center items-center">
      {children}
    </div>
  );
};

export default Card;
