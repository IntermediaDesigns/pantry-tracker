import React from "react";
import "../globals.css";

const Modal = ({ open, onClose, itemName, setItemName, addItem }) => {
  if (!open) return null;

  return (
    <>
      <div className="modal">
        <div className="modalHeader">
          <div></div>
          <h2>Add Item</h2>
          <button
            onClick={onClose}
            className="hover:scale-110 transition duration-300"
          >
            ❌
          </button>
        </div>
        <div>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter item name"
          />
          <button
            className="mt-4 mb-4 ml-auto mr-auto w-full bg-blue-500 text-white text-xl px-6 py-2 rounded-lg hover:bg-blue-700 hover:scale-110 transition duration-300 shadow-lg"
            onClick={() => {
              addItem(itemName);
              onClose();
            }}
          >
            Add Item
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;
