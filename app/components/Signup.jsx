'use client';
import React, { useState } from "react";
import { signUp } from "../../auth";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import "../globals.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const user = await signUp(username, password);
      console.log("Signed up successfully", user);
      router.push("/login");
    } catch (error) {
      console.error("Error signing up", error);
      setError(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="flex flex-col items-center justify-center"
        id="mainFormContainer"
      >
        <h1 className="mb-8">Sign Up</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500">{error}</p>}
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
