'use client';

import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Lexend_Peta } from 'next/font/google';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import DarkModeIcon from '@/assets/darkmodeicon.png';
import LightModeIcon from '@/assets/lightmodeicon.png';
import Image from 'next/image';

const lexendPetaStyle = Lexend_Peta({
    weight: '800',
    style: 'normal',
    subsets: ['latin']
});

function Header() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark', !isDarkMode);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const menuVariants = {
        open: { opacity: 1, scale: 1 },
        closed: { opacity: 0, scale: 0.95 },
    };

    return (
        <header className="bg-gradient-to-r from-amber-400 to-amber-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-amber-500 py-4 px-12 flex items-center justify-between shadow-lg backdrop-filter backdrop-blur-2xl bg-opacity-10 z-50">
            <div className="flex items-center space-x-5">
                <h1 className={`${lexendPetaStyle.className} uppercase text-sm`}>Bayard_One</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-5">
                <ul className="flex space-x-4">
                    <li>
                        <a href="https://bayardlab.org" className="text-sm hover:text-gray-600 dark:hover:text-amber-400">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="https://www.bayardlab.org/about-bayard-one" className="text-sm hover:text-gray-600 dark:hover:text-amber-400">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="https://docs.bayardlab.org" className="text-sm hover:text-gray-600 dark:hover:text-amber-400">
                            Documentation
                        </a>
                    </li>
                    <li>
                        <a href="https://www.bayardlab.org/contact" className="text-sm hover:text-gray-600 dark:hover:text-amber-400">
                            Contact
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="flex items-center space-x-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                                <span className="sr-only">Toggle Dark Mode</span>
                                <Image src={isDarkMode ? LightModeIcon : DarkModeIcon} alt={`${isDarkMode ? 'Light' : 'Dark'} Mode Icon`} width={25} height={25} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Toggle Dark Mode
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <button
                    className="md:hidden p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    onClick={toggleMobileMenu}
                >
                    <span className="sr-only">Open Menu</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 text-gray-800 dark:text-amber-500"
                    >
                        {isMobileMenuOpen ? (
                            <path d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu modal */}
            <Dialog
                open={isMobileMenuOpen}
                onClose={toggleMobileMenu}
                className="fixed inset-0 z-50 md:hidden"
            >
                <div className="fixed inset-0 bg-black opacity-50" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel
                        as={motion.div}
                        initial="closed"
                        animate={isMobileMenuOpen ? 'open' : 'closed'}
                        variants={menuVariants}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-md bg-gradient-to-r from-amber-400 to-amber-200 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg p-8"
                        >
                        <div className="flex flex-col space-y-6">
                        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-amber-500 mb-5">Menu</h2>
            <button
                                    onClick={toggleMobileMenu}
                                    className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                >
                                    <span className="sr-only">Close Menu</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                </button>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                <li>
                                    <a href="https://bayardlab.org" className="block text-base text-gray-800 dark:text-amber-500 hover:text-gray-600 dark:hover:text-amber-400">
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.bayardlab.org/about-bayard-one" className="block text-base text-gray-800 dark:text-amber-500 hover:text-gray-600 dark:hover:text-amber-400">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="https://docs.bayardlab.org" className="block text-base text-gray-800 dark:text-amber-500 hover:text-gray-600 dark:hover:text-amber-400">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.bayardlab.org/contact"  className="block text-base text-gray-800 dark:text-amber-500 hover:text-gray-600 dark:hover:text-amber-400">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                            <div className="mt-8 flex items-center">
                                <button onClick={toggleDarkMode} className="flex items-center">
                                    <Image src={isDarkMode ? LightModeIcon : DarkModeIcon} alt={`${isDarkMode ? 'Light' : 'Dark'} Mode Icon`} width={25} height={25} className="mr-2" />
                                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </header>
        );
    }
    
    export default Header;