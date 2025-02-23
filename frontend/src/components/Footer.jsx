import React from 'react'
import { Link } from 'react-router-dom'
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className='border-t border-gray-300 mt-10 py-12 '>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
            <div>
                <h3 className="text-lg text-gray-800 mb-4 ">NewLetter</h3>
                <p className="text-gray-500 mb-4">
                    Be the first to hear about new products , exlusive events, and online offers

                </p>
                <p className='font-medium tet-sm text-gray-500'>Sign up and get 10% off you first order</p>
                <form  className="flex mt-4">
                    <input type="email" 
                    placeholder='Enter your email address'
                    className='p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md
                    focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all' required
                    />
                    <button className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800
                    transistion-all">Subscrible</button>
                </form>
            </div>
            {/* shop links */}
            <div>
                <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
                <ul className="space-y-2 text-gray-600">
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>
                        Men's top wear
                        </Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>
                        Women's top wear
                        </Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>
                        Men's Bottom wear
                        </Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>
                        Women Bottom wear
                        </Link>
                    </li>
                </ul>
            </div>
            {/* support links */}
            <div>
                <h3 className="text-lg text-gray-800 mb-4">Support</h3>
                <ul className="space-y-2 text-gray-600">
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>
                         Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>
                         About Us
                        </Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>
                        FAQs
                        </Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>
                         Features
                        </Link>
                    </li>
                </ul>
            </div>

            {/* follows us */}
            <div>
                <h3 className="text-lg text-gray-800 mb-4">
                    Follow Us
                </h3>
                    <div className="flex  items-center space-x-4 mb-6">
                        <a href="https://www.facebook.com"  
                        className='hover:text-gray-500'>
                            <TbBrandMeta className='h-5 w-5'/>
                        </a>
                        <a href="https://www.facebook.com"  
                                              className='hover:text-gray-500'>
                            <IoLogoInstagram className='h-5 w-5'/>
                        </a>
                        <a href="https://www.facebook.com" 
                                             className='hover:text-gray-500'>
                            <RiTwitterXLine className='h-5 w-5'/>
                        </a>
                    </div>
                <p className="text-gray-500">Cell Us</p>
                <p className='flex text-gray-700 mt-2 items-center'>
                    <FiPhoneCall className='line-block mr-2'/>
                     123-456-789
                </p>
            </div>
        </div>
        {/* footer botton */}
        <div className="container mx-auto mt-12 px-4 lg:px-0 border-gray-200 pt-6 border-t ">
            <p className='text-gray-500 font-semibold text-sm text-center'>©️ 2025 , Fashion . All Rights Reserved</p>
        </div>
    </footer>
  )
}

export default Footer