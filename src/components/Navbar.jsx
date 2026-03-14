import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-12 py-8 text-white">
      <div className="text-2xl font-bold tracking-tighter">
        Vikash kumar<span className="text-[#35577D]">.</span>
      </div>
      <div className="text-gray-400 text-xs font-medium lowercase">
        heyvikash@icloud.com
      </div>
    </nav>
  );
};

export default Navbar;