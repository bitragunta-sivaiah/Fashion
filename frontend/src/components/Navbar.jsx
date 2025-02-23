import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import { CgShoppingBag } from "react-icons/cg";
import { TfiUser } from "react-icons/tfi";
import Search from './Search';
import Mobile from '../hook/Mobile';
import { useDispatch, useSelector } from 'react-redux';
import UserMenu from './UserMenu';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice';
import { useSearchParams } from 'react-router-dom';
import { setFilters } from '../store/productSlice';
import Cart from './Cart';
import Wishlist from './Wishlist'; // Import your Wishlist component

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const [isMobile] = Mobile();
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false); // State for wishlist drawer
  const { user } = useSelector((state) => state.auth);
  const [, setSearchParams] = useSearchParams();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logout Successfully!');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleAvatarClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCartClick = () => {
    if (user) {
      setCartOpen(!cartOpen);
    } else {
      toast.error('User not defined. Please log in to view the cart.');
      navigate('/login');
    }
  };

  const handleWishlistClick = () => {
    if (user) {
      setWishlistOpen(!wishlistOpen);
    } else {
      toast.error('User not defined. Please log in to view the wishlist.');
      navigate('/login');
    }
  };

  const handleNavigation = (url) => {
    setSearchParams({});
    dispatch(setFilters({}));
    navigate(url);
  };

  return (
    <>
      <div className='py-3'>
        {!(isSearchPage && isMobile) && (
          <div className='w-full h-20 bg-gray-50 px-2 flex items-center max-w-7xl mx-auto'>
            <Link to={'/'} className="text-xl lg:text-2xl font-bold">Fashion</Link>

            {/* Navlinks */}
            <div className="ml-auto text-sm hidden md:flex">
              <button onClick={() => handleNavigation('/collections/all?gender=Men')} className="mx-4 text-gray-600 hover:text-gray-800">
                MEN
              </button>
              <button onClick={() => handleNavigation('/collections/all?gender=Women')} className="mx-4 text-gray-600 hover:text-gray-800">
                WOMEN
              </button>
              <button onClick={() => handleNavigation('/collections/all?category=Top Wear')} className="mx-4 text-gray-600 hover:text-gray-800">
                TOPWEAR
              </button>
              <button onClick={() => handleNavigation('/collections/all?category=Bottom Wear')} className="mx-4 text-gray-600 hover:text-gray-800">
                BOTTOMWEAR
              </button>
            </div>

            {/* Search */}
            <div className="ml-auto hidden md:block">
              <Search />
            </div>

            {/* Icons: Wishlist, Cart, Profile */}
            <div className="flex items-center ml-auto gap-4 md:gap-8 relative">
              <button onClick={handleWishlistClick} className="flex items-center justify-center gap-1 flex-col">
                <FaRegHeart className='text-3xl md:text-xl' />
                <p className='hidden md:block font-bold'>WishList</p>
              </button>

              <button onClick={handleCartClick} className="flex items-center justify-center gap-1 flex-col">
                <CgShoppingBag className='text-3xl md:text-xl' />
                <p className='hidden md:block font-bold'>Cart</p>
              </button>

              {user ? (
                <div className="relative">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full cursor-pointer"
                    onClick={handleAvatarClick}
                  />
                  <div className="top-16 z-50 right-0 absolute bg-white shadow-lg">
                    {menuOpen && <UserMenu logout={handleLogout} />}
                  </div>
                </div>
              ) : (
                <Link to={'/login'} className="flex items-center justify-center gap-1 flex-col">
                  <TfiUser className='text-3xl md:text-xl' />
                  <p className='hidden md:block font-bold'>Profile</p>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Mobile Search */}
        <nav className='w-full lg:hidden relative bottom-2 mx-1 mt-5'>
          <Search />
        </nav>
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed top-0 right-0 h-full md:w-[70%] w-full bg-white shadow-lg p-4 overflow-y-auto z-50">
          <Cart userId={user._id} handleCartClick={handleCartClick} />
          <button
            className="absolute top-4 right-4 text-gray-600"
            onClick={handleCartClick}
          >
            Close
          </button>
        </div>
      )}

      {/* Wishlist Drawer */}
      {wishlistOpen && (
        <div className="fixed top-0 right-0 h-full max-w-7xl   w-fit bg-white shadow-lg p-4 overflow-y-auto z-50">
          <Wishlist userId={user._id} handleWishlistClick={handleWishlistClick} />
          <button
            className="absolute top-4 right-4 text-gray-600"
            onClick={handleWishlistClick}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
