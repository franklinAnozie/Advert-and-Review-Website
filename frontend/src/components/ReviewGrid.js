import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewGrid = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_ROOT_URL}/api/reviews`);
      const publishedReviews = response.data.filter((review) => review.is_published);
      setReviews(publishedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  return (
    <div className="review-grid py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Customer Reviews</h2>
      {reviews.length > 0 ? (
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 px-4">
          {reviews.map((review) => (
            <div key={review.id} className="review-card bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-bold mb-2">{review.title}</h3>
              <p className="text-gray-700 mb-4">{review.content}</p>
              <p className="text-sm text-gray-500">- {review.name}</p>
              {review.image_url && (
                <img
                  src={review.image_url}
                  alt={`Review by ${review.name}`}
                  className="mt-4 w-full h-40 object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No reviews available at the moment.</p>
      )}
    </div>
  );
};

export default ReviewGrid;
