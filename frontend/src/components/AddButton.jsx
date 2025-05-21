import addButton from "../assets/addButton.svg";

function AddButton({ onClick }) {
  return (
    <button
      className="btn btn-primary ml-10 w-6 h-4 bg-[var(--custom-background)] flex items-center justify-center rounded-full"
      onClick={onClick}
    >
      <img src={addButton} alt="Add Button" />
    </button>
  );
}

export default AddButton;
