import React from "react";
import Navbar from "./Navbar";
import "../globals.css";

export default function Signup() {
  return (
    <>
      <Navbar />
      <div
        className="flex flex-col items-center justify-center"
        id="mainFormContainer"
      >
        <h1 className="mb-8">Sign Up</h1>
        <form className="flex flex-col gap-4">
          <input type="text" name="name" id="name" placeholder="Name" />
          <input type="email" name="email" id="email" placeholder="Email" />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
          />
          <button type="submit">Sign Up</button>
        </form>
        <div>
          <p>
            Already have an account?
            <a href="/login"> Log In</a>
          </p>
        </div>
      </div>
    </>
  );
}
