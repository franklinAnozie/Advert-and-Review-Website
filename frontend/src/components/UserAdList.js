import React, { useState } from 'react';
import axios from 'axios';

const AdList = ({ ads, showMessage, onAdUpdated }) => {
  const [publishDuration, setPublishDuration] = useState('');
  const [publishingAdId, setPublishingAdId] = useState(null);
  const [editingAd, setEditingAd] = useState(null);

  const handleDeleteAd = async (adId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`${process.env.REACT_APP_ROOT_URL}/api/adverts/${adId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      showMessage('Ad Deleted Successfully');
      onAdUpdated();
    } catch (error) {
      showMessage('Error deleting ad!');
    }
  };

  const handlePublishAd = (adId) => {
    setPublishingAdId(adId);
  };

  const handlePublishAdSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post(`${process.env.REACT_APP_ROOT_URL}/api/adverts/${publishingAdId}/publish`, 
        { duration: publishDuration },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      showMessage('Ad Published Successfully');
      setPublishingAdId(null);
      setPublishDuration('');
      onAdUpdated();
    } catch (error) {
      showMessage('Error Publishing Ad!');
    }
  };

  const handleUnpublishAd = async (adId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post(`${process.env.REACT_APP_ROOT_URL}/api/adverts/${adId}/unpublish`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      showMessage('Ad Unpublished Successfully');
      onAdUpdated();
    } catch (error) {
      showMessage('Error Unpublishing Ad!');
    }
  };

  const handleEditAd = (ad) => {
    setEditingAd(ad);
  };

  const handleUpdateAd = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('name', editingAd.name);
      formData.append('email', editingAd.email);
      formData.append('phone', editingAd.phone);
      formData.append('content', editingAd.content);
      if (editingAd.photo_url instanceof File) {
        formData.append('file', editingAd.photo_url);
      }
      await axios.put(`${process.env.REACT_APP_ROOT_URL}/api/adverts/${editingAd.id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      showMessage("Advert updated successfully!");
      setEditingAd(null);
      onAdUpdated();
    } catch (error) {
      showMessage("Error updating ad!");
    }
  };

    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Adverts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => {
            const photoUrl = ad.photo_url ? `${process.env.REACT_APP_ROOT_URL}/${ad.photo_url.slice(1)}` : null;
            return (
            <div key={ad.id} className="bg-white p-4 rounded-lg shadow">
              <img src={photoUrl} alt={`Ad ${ad.id}`} className="w-full h-40 object-cover rounded mb-2" />
              <h3 className="font-semibold">{ad.name}</h3>
              <p className="mt-2">Email: {ad.email}</p>
              <p>Phone: {ad.phone}</p>
              <a href={ad.link_url} className="text-blue-500 hover:underline block mt-2">{ad.link_url}</a>
              <p className="mt-2 line-clamp-3">{ad.content}</p>
              <span className={`block my-2 ${ad.is_published ? 'text-green-500' : 'text-red-500'}`}>
                {ad.is_published ? 'Published' : 'Not Published'}
              </span>
              <div className="mt-4 space-x-2">
                <button 
                  onClick={() => handleEditAd(ad)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                {!ad.is_published && (
                  <button 
                    onClick={() => handlePublishAd(ad.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Publish
                  </button>
                )}
                {ad.is_published && (
                  <button 
                    onClick={() => handleUnpublishAd(ad.id)}
                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                    Unpublish
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteAd(ad.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )})}
          {publishingAdId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Publish Advertisement</h2>
                <form onSubmit={handlePublishAdSubmit} className="space-y-4">
                  <input
                    type="number"
                    placeholder="Duration in days"
                    value={publishDuration}
                    onChange={(e) => setPublishDuration(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <div className="flex justify-between mt-4">
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Confirm Publish
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPublishingAdId(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {editingAd && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg w-full max-w-md">
                  <h2 className="text-xl font-semibold mb-4">Edit Advertisement</h2>
                  <form onSubmit={handleUpdateAd} className="space-y-4">
                  <input
                      type="text"
                      placeholder="Name"
                      value={editingAd.name}
                      onChange={(e) => setEditingAd({ ...editingAd, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                  />
                  <input
                      type="email"
                      placeholder="Email Address"
                      value={editingAd.email}
                      onChange={(e) => setEditingAd({ ...editingAd, email: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                  />
                  <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={editingAd.phone}
                      onChange={(e) => setEditingAd({ ...editingAd, phone: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                  />
                  <textarea
                      placeholder="Content"
                      value={editingAd.content}
                      onChange={(e) => setEditingAd({ ...editingAd, content: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                  />
                  <input
                      type="file"
                      onChange={(e) => setEditingAd({ ...editingAd, photo_url: e.target.files[0] })}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                      type="submit"
                      className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                      Update Ad
                  </button>
                  <button
                    onClick={(e) => setEditingAd(null)}
                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Close
                  </button>
                  </form>
              </div>
              </div>
          )}
        </div>
      </div>
    );
}

export default AdList;
