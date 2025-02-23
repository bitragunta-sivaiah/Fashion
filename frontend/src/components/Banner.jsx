import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBanners } from '../store/bannerSlice';
import { motion } from 'framer-motion';

const Banner = () => {
    const dispatch = useDispatch();
    const { banners, status, error } = useSelector((state) => state.banners);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [progress, setProgress] = useState(0);

    // Fetch banners when component mounts
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchBanners());
        }
    }, [dispatch, status]);

    // Filter banners based on screen size
    const filteredBanners = useMemo(() => {
        return banners.filter((banner) =>
            isMobile ? banner.screen.type === 'mobile' : banner.screen.type === 'largeScreen'
        );
    }, [banners, isMobile]);

    // Handle banner change interval
    useEffect(() => {
        if (status === 'succeeded' && filteredBanners.length > 0) {
            const interval = setInterval(() => {
                setCurrentBanner((prev) => (prev + 1) % filteredBanners.length);
                setProgress(0);
            }, 5000); // Change banner every 5 seconds

            return () => clearInterval(interval);
        }
    }, [filteredBanners, status]);

    // Handle window resize events
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle progress bar increment
    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 2.5 : 100));
        }, 100); // Progress increments every 100ms

        return () => clearInterval(progressInterval);
    }, [currentBanner]);

    // Handle different banner loading states
    if (status === 'loading') {
        return <div>Loading banners...</div>;
    }

    if (status === 'failed') {
        return <div>Error loading banners: {error}</div>;
    }

    if (filteredBanners.length === 0) {
        return <div>No banners available for this screen size</div>;
    }

    return (
        <div className='relative my-10'>
            <div className="relative overflow-hidden w-full h-fit lg:h-fit max-md:rounded-2xl bg-white">
                <div
                    className="flex transition-transform duration-1000"
                    style={{ transform: `translateX(-${currentBanner * 100}%)` }}
                >
                    {filteredBanners.map((banner, index) => (
                        <motion.div
                            key={banner._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: index === currentBanner ? 1 : 0 }}
                            transition={{ duration: 0.8 }}
                            className={`w-full h-full overflow-hidden flex-shrink-0 ${index === currentBanner ? 'relative animate-play' : 'animate-normal'}`}
                        >
                            <img
                                src={banner.url}
                                alt={banner.public_id}
                                className="w-full h-full object-cover"
                            />
                         
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-[-20px] left-0 right-0 flex gap-4 justify-center p-2">
                {filteredBanners.map((_, index) => (
                    <div key={index} className="relative w-12 h-1 rounded-full overflow-hidden bg-gray-300">
                        {index === currentBanner && (
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-black"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: 'linear' }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banner;
