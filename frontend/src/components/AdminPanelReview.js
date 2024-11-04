import React from 'react';
import axios from 'axios';

const ReviewList = ({ reviews, showMessage, onReviewUpdated }) => {
  const handleDeleteReview = async (reviewId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`${process.env.REACT_APP_ROOT_URL}/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      showMessage('Review Deleted Successfully');
      onReviewUpdated();
    } catch (error) {
      showMessage('Error deleting review!');
    }
  };

  const handlePublishReview = async (reviewId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post(
        `${process.env.REACT_APP_ROOT_URL}/api/reviews/${reviewId}/publish`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      showMessage('Review Published Successfully');
      onReviewUpdated();
    } catch (error) {
      showMessage('Error publishing review!');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review) => {
          const photoUrl = review.photo_url ? `${process.env.REACT_APP_ROOT_URL}/${review.photo_url.slice(1)}` : null;
          return (
          <div key={review.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">{review.name}</h3>
            <p className="mt-2">{review.content}</p>
            <p className="text-gray-700">Email: {review.email}</p>
            <p className="text-gray-700">Mobile: {review.phone}</p>
            {photoUrl && (
              <img src={photoUrl} alt={`Review ${review.id}`} className="w-full h-40 object-cover rounded my-2" />
            )}
            <span className={`block my-2 ${review.is_published ? 'text-green-500' : 'text-red-500'}`}>
              {review.is_published ? 'Published' : 'Not Published'}
            </span>
            <div className="mt-4 space-x-2">
              {!review.is_published && (
                <button
                  onClick={() => handlePublishReview(review.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Publish
                </button>
              )}
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default ReviewList;
