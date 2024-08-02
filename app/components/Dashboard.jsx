"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { getAuth } from "firebase/auth";
import Modal from "../components/Modal.jsx";
import Navbar from "./Navbar";
import Image from "next/image";
import { generateImage } from "../../huggingface";
import placeholderImage from "../../public/placeholder.jpg";
import Grocerylist from "./Grocerylist";
import Footer from "./Footer";
import Favorites from "./Favorites";

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName("");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map((doc) => ({
      name: doc.id,
      ...doc.data(),
    }));
    setInventory(inventoryList);
  };

  const updateFavorites = useCallback(async () => {
    if (auth.currentUser) {
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setFavorites(userSnap.data().favorites || []);
      }
    }
  }, [auth.currentUser, setFavorites]);

  const addItem = async (item) => {
    setIsLoading(true);
    try {
      console.log(`Generating image for ${item}...`);
      let imageUrl = await generateImage(`A photo of one ${item}`);
      console.log(`Image URL generated: ${imageUrl}`);

      if (!imageUrl) {
        console.error("Failed to generate image, using placeholder");
        imageUrl = "/placeholder.jpg"; // Use the path to your placeholder image
      }

      const docRef = doc(collection(firestore, "inventory"), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, {
          quantity: quantity + 1,
          imageUrl: imageUrl,
        });
      } else {
        await setDoc(docRef, {
          quantity: 1,
          imageUrl: imageUrl,
        });
      }

      console.log(`Item ${item} added successfully`);
      await updateInventory();
      setItemName("");
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeQuantity = async (item, change) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      const newQuantity = Math.max(0, quantity + change);
      await setDoc(docRef, { quantity: newQuantity });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const toggleFavorite = async (itemName) => {
    if (auth.currentUser) {
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      if (favorites.includes(itemName)) {
        await updateDoc(userRef, {
          favorites: arrayRemove(itemName),
        });
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(itemName),
        });
      }
      await updateFavorites();
    } else {
      console.log("User not logged in");
      // You might want to show a login prompt here
    }
  };

  useEffect(() => {
    updateInventory();
    updateFavorites();
  }, [updateFavorites]);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <Modal
        open={open}
        onClose={handleClose}
        itemName={itemName}
        setItemName={setItemName}
        addItem={addItem}
      />
      <div className="dashboard">
        <div className="leftDashboard">
          <div>
            <Favorites favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
          <div>
            <Grocerylist inventory={inventory} userId={auth.currentUser?.uid} />
          </div>
        </div>

        <div className="inventory">
          <div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h1>Inventory</h1>
              <div className="searchContainer">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search items..."
                />
                <button
                  onClick={handleSearch}
                  className="ml-4 bg-blue-500 text-white text-xl px-6 py-2 rounded-lg hover:bg-blue-700 hover:scale-110 transition duration-300 shadow-lg"
                >
                  Search
                </button>
              </div>

              <button
                onClick={handleOpen}
                className="bg-blue-500 text-white text-xl mb-8 px-6 py-2 rounded-lg hover:bg-blue-700 hover:scale-110 transition duration-300 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Item"}
              </button>
            </div>
            <div className="inventoryItems">
              {filteredInventory.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 border-b mb-4"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <Image
                      src={placeholderImage}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover rounded-lg"
                    />
                  )}
                  <span className="text-left font-medium text-xl text-white tracking-wider capitalize w-24 mr-16">
                    {item.name}
                  </span>
                  <div className="flex items-center w-10 mr-8">
                    <button
                      onClick={() => changeQuantity(item.name, -1)}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l hover:bg-gray-500"
                      disabled={item.quantity === 0}
                    >
                      -
                    </button>
                    <span className="px-3 font-semibold text-yellow-500">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => changeQuantity(item.name, 1)}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r hover:bg-gray-500"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.name)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => toggleFavorite(item.name)}
                    className={`text-2xl focus:outline-none ${
                      favorites.includes(item.name)
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                  >
                    {favorites.includes(item.name) ? "⭐" : "☆"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
