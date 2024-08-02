"use client";
import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const Grocerylist = ({ inventory, userId }) => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    const fetchGroceryList = async () => {
      if (userId) {
        const userDocRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().groceryList) {
          setGroceryItems(userDoc.data().groceryList);
        }
      }
    };

    fetchGroceryList();
  }, [userId]);

  const addGroceryItem = async () => {
    if (selectedItem && !groceryItems.includes(selectedItem) && userId) {
      const userDocRef = doc(firestore, "users", userId);
      await setDoc(
        userDocRef,
        {
          groceryList: arrayUnion(selectedItem),
        },
        { merge: true }
      );

      setGroceryItems([...groceryItems, selectedItem]);
      setSelectedItem("");
    }
  };

  const removeGroceryItem = async (itemToRemove) => {
    if (userId) {
      const userDocRef = doc(firestore, "users", userId);
      await setDoc(
        userDocRef,
        {
          groceryList: arrayRemove(itemToRemove),
        },
        { merge: true }
      );

      setGroceryItems(groceryItems.filter((item) => item !== itemToRemove));
    }
  };

  return (
    <div className="groceryContainer">
      <h1>Grocery List</h1>
      <div className="dropdownContainer flex gap-4">
        <select
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          className="mr-2"
        >
          <option value="">Select from inventory</option>
          {inventory.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <button
          onClick={addGroceryItem}
          className="bg-blue-500 text-white text-xl mb-8 px-6 py-4 rounded-lg hover:bg-blue-700 hover:scale-110 transition duration-300 shadow-lg"
          disabled={!selectedItem || !userId}
        >
          Add to Grocery List
        </button>
      </div>
      <div className="groceryList mt-2">
        <ul>
          {groceryItems.map((item) => (
            <li key={item} className="flex justify-between items-center mb-2">
              <span>{item}</span>
              <button
                onClick={() => removeGroceryItem(item)}
                className="bg-red-500 text-white px-2 py-1 rounded mt-2 hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Grocerylist;
