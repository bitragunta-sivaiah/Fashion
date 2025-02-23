import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import NewArrivals from '../components/NewArrivals';
import GenderCollectionSection from '../components/GenderCollectionSection';
import BestSellersPage from '../components/BestSellersPage ';
import FeaturedCollection from '../components/FeaturedCollection';
import FeaturesSection from '../components/FeaturesSection';
 
 
const Home = () => {
 

 

  
 

  // console.log("best", bestSellerProduct);

  return (
    <div>
      <div className="mx-4">
        <Banner />
        <NewArrivals />
        <GenderCollectionSection />
        <h2 className="text-3xl text-center font-bold mb-4">
          Best Sellers
        </h2>
        <BestSellersPage/>
        <FeaturedCollection/>
        <FeaturesSection/>
    
        </div>
 
    </div>
  );
}

export default Home;
