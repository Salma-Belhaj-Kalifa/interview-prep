import React from 'react';
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/80 shadow-md border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        
        {/* Logo / Brand */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 hover:text-orange-500 transition-colors duration-300">
            Interview Prep AI
          </h2>
        </Link>

        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <ProfileInfoCard />
        </div>

      </div>
    </div>
  );
};

export default Navbar;
