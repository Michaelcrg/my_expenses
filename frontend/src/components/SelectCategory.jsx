import React from "react";
import Select from "react-select";

const SelectCategory = ({ categories, selectedCategory, onCategoryChange }) => {
  const customStyles = {
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    control: (provided) => ({
      ...provided,
      borderColor: "white",
      borderRadius: "0.5rem",
      padding: "0.5rem",
      backgroundColor: "var(--custom-background)",
    }),
    menu: (provided) => ({
      ...provided,
      color: "white",
      maxHeight: "200px", 
      overflowY: "auto",  
      borderRadius: "0.5rem",
      backgroundColor: "var(--custom-background)",
      paddingRight: "10px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "blue" : "transparent",
      color: state.isSelected ? "white" : "black",
      padding: "10px",
      cursor: "pointer",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
  };
  
  
  

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.nome,
  }));

  return (
<Select
  options={categoryOptions}
  value={selectedCategory}
  onChange={onCategoryChange}
  placeholder="Seleziona una categoria"
  styles={customStyles}
  isSearchable={false} 
/>

  );
};

export default SelectCategory;
