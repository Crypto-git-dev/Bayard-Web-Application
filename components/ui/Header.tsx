'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Lexend_Peta } from 'next/font/google';
import BAYARD_LAB from '@/assets/bayard_lab.png';
import BAYARD_LAB_YELLOW from '@/assets/bayard_lab_yellow.png';
import BetaBanner from './Beta';

const lexendPetaStyle = Lexend_Peta({
    weight: '800',
    style: 'normal',
    subsets: ['latin']
});



function Header() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const mobileMenuClasses = isMobile
? `fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center space-y-8 z-50 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`
: 'hidden md:flex items-center space-x-4';

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark', !isDarkMode);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [isOpen, setIsOpen] = useState(true);

    const toggleBanner = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-gradient-to-r from-amber-400 to-amber-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-amber-500 py-4 px-12 flex items-center justify-between shadow-lg backdrop-filter backdrop-blur-2xl bg-opacity-10">
            <div className="flex items-center space-x-5">
                <h1 className={`${lexendPetaStyle.className} uppercase text-sm`}>Bayard_One</h1>
            </div>
            <div className="flex items-center space-x-4">
                <nav className={`${mobileMenuClasses}`}>
                    <ul className={`${isMobile ? 'flex flex-col items-center space-y-4' : 'flex space-x-4'}`}>
                        <li>
                            <a href="https://bayardlab.org" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-600 dark:hover:text-amber-400">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="https://www.bayardlab.org/about-bayard-one" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-600 dark:hover:text-amber-400">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="https://docs.bayardlab.org" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-600 dark:hover:text-amber-400">
                                Documentation
                            </a>
                        </li>
                        <li>
                            <a href="https://www.bayardlab.org/contact" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-600 dark:hover:text-amber-400">
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>
                </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                            <span className="sr-only">Toggle Dark Mode</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`w-5 h-5 ${isDarkMode ? 'text-amber-500' : 'text-gray-500'}`}
                            >
                                {isDarkMode ? (
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
                                    />
                                ) : (
                                    <path d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C12.75 6.58579 12.4142 6.25 12 6.25C11.5858 6.25 11.25 6.58579 11.25 7V12C11.25 12.4142 11.5858 12.75 12 12.75C12.4142 12.75 12.75 12.4142 12.75 12V7Z" />
                                )}
                            </svg>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Toggle Dark Mode
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        {isMobile && (
            <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
                <span className="sr-only">Toggle Menu</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                >
                    {isMenuOpen ? (
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        />
                    ) : (
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                        />
                    )}
                </svg>
            </button>
        )}
        </header>
        )
    }

export default Header;