import React from "react";
import Image from "next/image";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav className="bg-white shadow-md px-10 py-4 flex items-center justify-between w-full">
      <Image src="/icon.ico" width={40} height={40} alt="Picture" />
      <div className="hidden md:flex items-center space-x-6">
        <a href="#" className="text-gray-500 hover:text-gray-800">
          Oussama
        </a>
        <a href="#" className="text-gray-500 hover:text-gray-800">
          Hareth
        </a>
      </div>
    </nav>
  );
};5

export default Navbar;
