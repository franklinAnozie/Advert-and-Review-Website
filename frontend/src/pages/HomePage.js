import React from 'react';
import Header from '../components/Header';
import AdCarousel from '../components/AdCarousel';
import ReviewGrid from '../components/ReviewGrid';
import Form from '../components/Form';
import Footer from '../components/Footer';
import '../style/index.css';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <section className="container mx-auto px-4 py-8">
        <AdCarousel />
      </section>
      <section className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg">
        <ReviewGrid />
      </section>
      <section className="container mx-auto px-4 py-8">
        <Form />
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
