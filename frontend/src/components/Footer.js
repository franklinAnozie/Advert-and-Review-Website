import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto text-center">
        <p className="mb-4">&copy; 2024 Ad and Review Website. All rights reserved.</p>
        <nav>
          <ul className="flex justify-center space-x-6">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="/admin-login" className="hover:underline">Admin Login</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
