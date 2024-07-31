import React from "react";
import "../globals.css";

function FrontPage() {
  return (
    <>
      <section>
        <div className="flex justify-center items-start my-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Pantry!</h1>
            <p className="text-lg">The best way to manage your pantry.</p>
            <div className="mt-8">
              <a
                href="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Login
              </a>
              <a
                href="/signup"
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="flex justify-center items-center gap-16">
          <div>
            <img
              src="https://via.placeholder.com/300"
              alt="pantry"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Features</h1>
            <p className="text-lg">Here are some of the features of Pantry:</p>
            <div className="mt-8">
              <ul className="text-left">
                <li className="mb-4">Add items to your pantry</li>
                <li className="mb-4">Remove items from your pantry</li>
                <li className="mb-4">Track expiration dates</li>
                <li className="mb-4">Get notified when items are expiring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FrontPage;
