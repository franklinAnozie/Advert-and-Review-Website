import React from 'react';

const Header = ({ onLogout }) => (
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    <button 
      onClick={onLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  </div>
);

export default Header;
