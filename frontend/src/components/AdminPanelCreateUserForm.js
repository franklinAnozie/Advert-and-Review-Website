import React, { useState } from 'react';
import axios from 'axios';

const CreateUserForm = ({ showMessage }) => {
  const [newUser, setNewUser] = useState({ email: '', password: '' });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post(`${process.env.REACT_APP_ROOT_URL}/admin/create`, 
        { ...newUser }, 
        { headers: { 
          Authorization: `Bearer ${accessToken}`,
          'X-Secret-Key': `${process.env.REACT_APP_SECRET_KEY}`
        }}
      );
      setNewUser({ email: '', password: '' });
      showMessage("User created successfully!");
    } catch (error) {
      showMessage("An error occurred while creating the user.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Admin User</h2>
      <form onSubmit={handleCreateUser} className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
