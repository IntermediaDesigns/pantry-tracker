/* eslint-disable @next/next/no-img-element */
import React from "react";
import "../globals.css";

function FrontPage() {
  return (
    <div className="wrapper">
      <section className="heroSection">
        <div className="typewriter">
          <h1>Welcome to Pantry Pro!</h1>
        </div>
        <p>The best way to manage your pantry.</p>
        <div className="mt-8 flex justify-center gap-5">
          <a
            href="/login"
            className="bg-blue-500 text-white text-xl px-6 py-2 rounded-lg hover:bg-blue-700 hover:scale-110 transform transition duration-300 shadow-lg"
          >
            Login
          </a>
          <a
            href="/signup"
            className="ml-4 bg-blue-500 text-white text-xl px-6 py-2 rounded-lg hover:bg-blue-700 hover:scale-110 transition duration-300 shadow-lg"
          >
            Sign Up
          </a>
        </div>
      </section>
      <section className="featuresHero">
        <div className="flex justify-center items-center gap-16" id="featuresContainer">
          <div className="imgContainer">
            <img
              src="../../fruitveggies.jpg"
              alt="pantry"
              className="rounded-lg shadow-lg"
              id="frontImg"
            />
          </div>
          <div className="text-center">
            <div>
              <h1>Features</h1>
            </div>
            <p className="text-lg">Here are some of the features of Pantry Pro:</p>
            <div className="mt-8">
              <ul className="text-left">
                <li className="mb-4">Add items to your pantry</li>
                <li className="mb-4">Remove items from your pantry</li>
                <li className="mb-4">Save your list</li>
                <li className="mb-4">Add items to your favorites</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="flex justify-center items-center">
          <p>&copy; 2024 Pantry Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default FrontPage;
