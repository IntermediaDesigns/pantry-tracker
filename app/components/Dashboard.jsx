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
import Recipes from "./Recipes";

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [groceryList, setGroceryList] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName("");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const updateGroceryList = useCallback(async () => {
    if (auth.currentUser) {
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setGroceryList(userSnap.data().groceryList || []);
      }
    }
  }, [auth.currentUser]);

  const updateInventory = useCallback(async () => {
    if (auth.currentUser) {
      const snapshot = query(
        collection(firestore, `users/${auth.currentUser.uid}/inventory`)
      );
      const docs = await getDocs(snapshot);
      const inventoryList = docs.docs.map((doc) => ({
        name: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
    }
  }, [auth.currentUser, setInventory]);

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
        imageUrl = "/placeholder.jpg";
      }

      const docRef = doc(
        collection(firestore, `users/${auth.currentUser.uid}/inventory`),
        item
      );
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
    const docRef = doc(
      collection(firestore, `users/${auth.currentUser.uid}/inventory`),
      item
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      const newQuantity = Math.max(0, quantity + change);
      await setDoc(docRef, { quantity: newQuantity });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;

    // Remove from inventory
    const inventoryDocRef = doc(
      collection(firestore, `users/${userId}/inventory`),
      item
    );
    await deleteDoc(inventoryDocRef);

    // Remove from favorites if it exists there
    if (favorites.includes(item)) {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        favorites: arrayRemove(item),
      });
      setFavorites(favorites.filter((fav) => fav !== item));
    }

    // Remove from grocery list if it exists there
    const userRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userRef);
    if (
      userDoc.exists() &&
      userDoc.data().groceryList &&
      userDoc.data().groceryList.includes(item)
    ) {
      await updateDoc(userRef, {
        groceryList: arrayRemove(item),
      });
      // Update local groceryList state
      setGroceryList((prevList) =>
        prevList.filter((listItem) => listItem !== item)
      );
    }

    await updateInventory();
    await updateFavorites();
    await updateGroceryList();
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
    if (auth.currentUser) {
      updateInventory();
      updateFavorites();
      updateGroceryList();
    }
  }, [auth.currentUser, updateFavorites, updateInventory, updateGroceryList]);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
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
            <Recipes inventory={inventory} />
          </div>
          <div>
            <Favorites favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
          <div>
            <Grocerylist
              inventory={inventory}
              userId={auth.currentUser?.uid}
              groceryList={groceryList}
              setGroceryList={setGroceryList}
            />
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
                  id="inventoryItem"
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
                    className="text-xl hover:scale-110 transition duration-300"
                  >
                    🗑️
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
    </section>
  );
}
