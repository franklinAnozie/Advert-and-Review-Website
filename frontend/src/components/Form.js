import React, { useState } from 'react';
import axios from 'axios';

const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <p className="mb-4">{message}</p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'review',
    content: '',
    photo_url: null,
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'image' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = localStorage.getItem('accessToken');
    const dataToSubmit = new FormData();
    dataToSubmit.append('name', formData.name);
    dataToSubmit.append('email', formData.email);
    dataToSubmit.append('phone', formData.phone);
    dataToSubmit.append('content', formData.content);
    if (formData.image) {
      dataToSubmit.append('file', formData.image); 
    }
    try {
      const url = formData.type === "advert" ? '/api/adverts' : '/api/reviews';
      await axios.post(`${process.env.REACT_APP_ROOT_URL}${url}`, dataToSubmit, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`${formData.type === "advert" ? "Advert" : "Review"} posted successfully!`);
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'review',
        content: '',
        photo_url: null,
      });
    } catch (error) {
      setMessage('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="form-section bg-gray-100 p-8 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Submit a {formData.type}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="name" className="block mb-1">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="block mb-1">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone" className="block mb-1">Mobile:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="form-group">
          <label htmlFor="type" className="block mb-1">Type:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="review">Review</option>
            <option value="advert">Advert</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="content" className="block mb-1">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image" className="block mb-1">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {isModalOpen && <Modal message={message} onClose={closeModal} />}
    </div>
  );
};

export default Form;
