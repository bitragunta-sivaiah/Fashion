import React from 'react';
import mensCollectionImage from '../assets/men.jpg';
import womensCollectionImage from '../assets/women.jpg';
import { Link } from 'react-router-dom';

const GenderCollectionSection = () => {
  return (
    <section className='py-16 px-4 lg:px-0 mt-10'>
        <h1 className='text-xl md:text-3xl font-bold text-center mb-5'>Exclusive Gender Collections</h1>
<p className='text-sm md:text-xl text-gray-900 text-center mb-5'>Explore our refined selections tailored to diverse identities. Each collection embodies unique elegance and versatility, catering to distinct tastes and styles. Discover pieces that resonate with your individuality and elevate your wardrobe with our exclusive gender collections.</p>

  <div className="container mx-auto flex flex-col md:flex-row gap-8">
    {/* women collections */}
    <div className="flex-1 relative">
        <img src={womensCollectionImage} 
        alt="women collection"
        className='w-full h-[700px] object-cover'
        />
        <div className="top-[80%] absolute left-8 w-fit bg-white bg-opacity-90 p-4">
            <h2 className="md:text-2xl text-xl  font-bold text-gray-900 mb-3">
                Women's Collections
            </h2>
            <Link to={'/collections/all?gender=Women'} 
            className='text-gray-900 underline'>
                Shop Now
            </Link>
        </div>
    </div>
    {/* mens collections */}
    <div className="flex-1 relative">
        <img src={mensCollectionImage} 
        alt="women collection"
        className='w-full h-[700px] object-cover'
        />
        <div className="top-[80%] absolute left-8 w-fit bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Men's Collections
            </h2>
            <Link to={'/collections/all?gender=Men'} 
            className='text-gray-900 underline'>
                Shop Now
            </Link>
        </div>
    </div>
  </div>
    </section>
  );
};

export default GenderCollectionSection;
