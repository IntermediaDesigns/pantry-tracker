import React from "react";
import "../globals.css";
import Image from "next/image";

function Navbar() {
  return (
    <nav className="mx-8 my-4 flex justify-between items-center">
      <a href="/">
        <Image
          src="/pantry.png"
          alt=""
          width={80}
          height={80}
          className="hover:scale-110 transform transition duration-300"
        />
      </a>
      <div>
        <a
          href="/logout"
          className="bg-blue-500 text-white text-xl px-6 py-2 rounded-lg flex  hover:bg-blue-700 hover:scale-110 transform transition duration-300 shadow-lg"
        >
          Logout
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
