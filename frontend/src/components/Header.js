import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-blue-600 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center text-white">
        <h1 className="text-3xl font-bold">Ad and Review Website</h1>
        <button
          className="bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-blue-700 hover:text-white transition duration-300"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </div>
    </header>

  );
};

export default Header;
