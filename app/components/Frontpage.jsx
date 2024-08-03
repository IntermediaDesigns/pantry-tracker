import React from "react";
import "../globals.css";
import Footer from "./Footer";

function FrontPage() {
  return (
    <main>
      <section className="heroSection">
        <div className="typewriter">
          <h1>Welcome to Pantry Pro!</h1>
        </div>
        <p>The best way to manage your pantry.</p>
      </section>
      <section className="featuresHero">
        <div
          className="flex justify-center items-center gap-16"
          id="featuresContainer"
        >
          <div>
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
            <p className="text-lg mr-16">
              Here are some of the features of Pantry Pro:
            </p>
            <div className="mt-8">
              <ul className="text-left">
                <li className="mb-4 ">Add items to your pantry</li>
                <li className="mb-4">Remove items from your pantry</li>
                <li className="mb-4">Save to your grocery list</li>
                <li className="mb-4">Add items to your favorites</li>
                <li className="mb-4">See recipe suggestions based on your inventory</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default FrontPage;
