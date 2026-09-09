import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';
import DealsSection from '../components/home/DealsSection';
import NewArrivals from '../components/home/NewArrivals';

const HomePage = () => {
  return (
    <div className="space-y-0">
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <DealsSection />
      <NewArrivals />
    </div>
  );
};

export default HomePage;

