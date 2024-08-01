import React from 'react'
import Navbar from './Navbar'

export default function Login() {
  return (
    <>
      <Navbar />
      <div
        className="flex flex-col items-center justify-center"
        id="mainFormContainer"
      >
        <h1 className="mb-8">Log In</h1>
        <form className="flex flex-col gap-4">
          <input type="email" name="email" id="email" placeholder="Email" />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
        <div>
          <p>
            Need an account?
            <a href="/signup"> Sign Up</a>
          </p>
        </div>
      </div>
    </>
  )
}
