import React, { useEffect, useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeftLong } from "react-icons/fa6";
import Mobile from '../hook/Mobile';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = Mobile();
  const params = useLocation();
  const searchText = params.search.slice(3);

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    const url = `/search?q=${value}`;
    navigate(url);
  };

  return (
    <div className='w-full min-w-[260px] lg:min-w-[420px] h-11 lg:h-12 border-2 border-transparent overflow-hidden flex rounded-lg items-center text-neutral-500 bg-gray-100 group'>
      <div>
        {isMobile && isSearchPage ? (
          <Link to={"/"} className='flex justify-center items-center h-full p-2 m-1 group-focus-within:text-violet-500'>
            <FaArrowLeftLong size={20} />
          </Link>
        ) : (
          <button className='flex justify-center items-center h-full p-3 group-focus-within:text-violet-500'>
            <FiSearch size={22} />
          </button>
        )}
      </div>
      <div className='w-full h-full'>
        {!isSearchPage ? (
          // Not in search page
          <div onClick={redirectToSearchPage} className='w-full h-full flex items-center'>
            <TypeAnimation
              sequence={[
                'Search for "MEN"',
                1000,
                'Search for "WOMEN"',
                1000,
                'Search for "TOP WEAR"',
                1000,
                'Search for "BOTTOM WEAR"',
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          // When in search page
          <div className='w-full h-full'>
            <input
              type='text'
              placeholder='Search for MENS WOMENS and more.'
              autoFocus
              defaultValue={searchText}
              className='bg-transparent w-full h-full outline-none'
              onChange={handleOnChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
