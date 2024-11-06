import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/UserPanelHeader';
import CreateAdForm from '../components/UserPanelCreateAdForm';
import AdList from '../components/UserAdList';
import ReviewList from '../components/UserPanelReview';
import Modal from '../components/AdminPanelModal';
import '../style/Admin.css'

const UserDashboard = () => {
  const [ads, setAds] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const adsResponse = await axios.get(`${process.env.REACT_APP_ROOT_URL}/api/adverts`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAds(adsResponse.data);
      const reviewsResponse = await axios.get(`${process.env.REACT_APP_ROOT_URL}/api/reviews`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setReviews(reviewsResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 sm:p-4">
      <Header onLogout={handleLogout} />
      <CreateAdForm showMessage={showMessage} onAdCreated={fetchData} />
      <AdList ads={ads} showMessage={showMessage} onAdUpdated={fetchData} />
      <ReviewList reviews={reviews} showMessage={showMessage} onReviewUpdated={fetchData} />
      {isModalOpen && <Modal message={message} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default UserDashboard;