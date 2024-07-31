import React from "react";
import "../globals.css";
import Image from "next/image";

function Navbar() {
  return (
    <nav className="mx-8 my-4 flex justify-between items-center">
      <a href="#">
        <Image src="/pantry.png" alt="" width={80} height={80} />
      </a>
      <div>
        <a
          href=""
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Logout
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
