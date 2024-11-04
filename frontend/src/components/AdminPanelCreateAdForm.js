import React, { useState } from 'react';
import axios from 'axios';

const CreateAdForm = ({ showMessage, onAdCreated }) => {
  const [newAd, setNewAd] = useState({
    name: '',
    email: '',
    phone: '',
    content: '',
    photo_url: null
  });

  const handleCreateAd = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      const formData = new FormData();
      Object.keys(newAd).forEach(key => {
        if (key === 'photo_url' && newAd[key]) {
          formData.append('file', newAd[key]);
        } else {
          formData.append(key, newAd[key]);
        }
      });
      await axios.post(`${process.env.REACT_APP_ROOT_URL}/api/adverts`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      showMessage("Advert created successfully!");
      setNewAd({
        name: '',
        email: '',
        phone: '',
        content: '',
        photo_url: null,
      });
      onAdCreated();
    } catch (error) {
      showMessage("Error creating ad!");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Ad</h2>
      <form onSubmit={handleCreateAd} className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Name"
          value={newAd.name}
          onChange={(e) => setNewAd({ ...newAd, name: e.target.value })}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={newAd.email}
          onChange={(e) => setNewAd({ ...newAd, email: e.target.value })}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="tel"
          placeholder="Mobile Number"
          value={newAd.phone}
          onChange={(e) => setNewAd({ ...newAd, phone: e.target.value })}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Content"
          value={newAd.content}
          onChange={(e) => setNewAd({ ...newAd, content: e.target.value })}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          onChange={(e) => setNewAd({ ...newAd, photo_url: e.target.files[0] })}
          className="p-2 border border-gray-300 rounded"
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Create Ad
        </button>
      </form>
    </div>
  );
};

export default CreateAdForm;
