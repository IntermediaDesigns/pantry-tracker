"use client";
import React, { useState, useEffect } from "react";
import "../globals.css";
import Image from "next/image";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className="mx-8 my-4 flex justify-between items-center">
      <a href="/">
        <Image
          src="/pantry.png"
          alt=""
          width={80}
          height={80}
          className="hover:scale-110 transform transition duration-300"
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </a>
      <div>
        {user ? (
          <div className="flex gap-8" id="navLinks">
            <a
              href="/dashboard"
              className="bg-blue-500 text-white text-xl px-6 py-2 rounded-lg flex hover:bg-blue-700 hover:scale-110 transform transition duration-300 shadow-lg"
            >
              Dashboard
            </a>
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white text-xl px-6 py-2 rounded-lg flex hover:bg-blue-700 hover:scale-110 transform transition duration-300 shadow-lg"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="mt-8 flex justify-center gap-7" id="navLinks">
            <a
              href="/login"
              className="bg-blue-500 text-white text-xl px-6 py-2 rounded-lg hover:bg-blue-700 hover:scale-110 transform transition duration-300 shadow-lg"
            >
              Login
            </a>
            <a
              href="/signup"
              className="bg-blue-500 text-white text-xl px-6 py-2 rounded-lg hover:bg-blue-700 hover:scale-110 transition duration-300 shadow-lg"
            >
              Sign Up
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
