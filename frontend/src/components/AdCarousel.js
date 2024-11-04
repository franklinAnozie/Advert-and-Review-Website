import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const AdCarousel = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_ROOT_URL}/api/adverts`);
      const publishedAds = response.data.filter((ad) => ad.is_published);
      setAds(publishedAds);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="ad-carousel max-w-4xl mx-auto py-8">
      {ads.length > 0 ? (
        <Slider {...settings}>
          {ads.map((ad) => {
            const photoUrl = ad.photo_url ? `${process.env.REACT_APP_ROOT_URL}/${ad.photo_url.slice(1)}` : null;
            return (
              <div key={ad.id} className="flex justify-center">
                {photoUrl ? (
                  <a href={photoUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={photoUrl}
                      alt={`Ad ${ad.id}`}
                      className="w-full h-auto max-h-[500px] object-contain md:max-h-[400px] sm:max-h-[300px] rounded-lg"
                    />
                  </a>
                ) : (
                  <p className="text-center">Image not available</p>
                )}
              </div>
            );
          })}
        </Slider>
      ) : (
        <p className="text-center text-gray-500">No ads available at the moment.</p>
      )}
    </div>
  );
};

export default AdCarousel;
