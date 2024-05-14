'use client';

import { useState, useEffect } from "react";

const BetaBanner = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [bannerOpacity, setBannerOpacity] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            const fadeOut = setInterval(() => {
                setBannerOpacity((prevOpacity) => {
                    const newOpacity = prevOpacity - 0.05;
                    if (newOpacity <= 0) {
                        clearInterval(fadeOut);
                        setIsOpen(false);
                    }
                    return newOpacity;
                });
            }, 500);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const toggleBanner = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className={`bg-gradient-to-r from-gray-800 to-gray-700 text-amber-100 dark:from-amber-500 dark:to-amber-400 dark:text-gray-800 p-4 shadow-md`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-400 dark:text-gray-800">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span className="font-bold">Beta</span>
                </div>
                <button onClick={toggleBanner} className="focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ml-2 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
            </div>
            {isOpen && (
                <p className="text-xs mt-2">
                    Bayard is an open-source, beta-stage AI research assistant designed to facilitate access to LGBTQ+ scholarship; while it aims to provide reliable information, users should think critically, fact-check key details, and consult primary sources as they would with any research tool.
                </p>
            )}
        </div>
    );
};

export default BetaBanner;
