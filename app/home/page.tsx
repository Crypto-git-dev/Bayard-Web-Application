'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import BAYARD_LAB_YELLOW from '@/assets/BAYARD_LAB_YELLOW.png';
import BAYARD_LAB from '@/assets/BAYARD_LAB.png';
import { Lexend_Peta } from "next/font/google";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Lottie from "react-lottie-player";
import { motion, AnimatePresence } from 'framer-motion';
import DigitalPortal from '@/assets/digital_portal.json';


const lexendPetaStyle = Lexend_Peta({
    weight: '800',
    style: 'normal',
    subsets: ['latin']
});

export default function HomePage() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDarkMode);
        document.body.classList.toggle('dark', prefersDarkMode);
    }, []);

    const toggleDarkMode = () => {
        const newIsDarkMode = !isDarkMode;
        setIsDarkMode(newIsDarkMode);
        document.body.classList.toggle('dark', newIsDarkMode);
    };

    return (
        <div className="flex flex-col min-h-screen text-base bg-gray-100 dark:bg-gray-900 dark:text-base dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:bg-fixed dark:bg-opacity-100">
            <header className="bg-gradient-to-r from-amber-200 to-amber-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-amber-500 py-3 px-6 flex items-center justify-between shadow-lg backdrop-filter backdrop-blur-2xl bg-opacity-10 sticky top-0 z-50">
                <a href="https://bayardlab.org" target="_blank" rel="noopener noreferrer">
                    <Image src={isDarkMode ? BAYARD_LAB_YELLOW : BAYARD_LAB} alt="Bayard Lab Logo" width={150} height={50} />
                </a>
                <nav>
                    <ul className="flex space-x-4 items-center">
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
                        <li>
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
                                                        d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3V21Z"
                                                    />
                                                ) : (
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20V4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                                                    />
                                                )}
                                            </svg>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left" sideOffset={30}>
                                        <p>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="flex-grow">
                <div className="container mx-auto py-3">
                    <div className="rounded-lg p-3">
                        <div className="flex items-center justify-between pb-5 px-12">
                            <div className="text-center p-10">
                                <motion.h2 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="text-hero md:text-8xl lg:text-9xl font-bold mb-6 text-gray-600 dark:text-amber-400 leading-tight"
                                >
                                    Empowering Change Through <br></br><span className="text-gray-500 dark:text-amber-500">Artificial Intelligence</span>
                                </motion.h2>
                                <motion.p 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                    className="text-l mb-8 text-gray-700 dark:text-gray-300 leading-relaxed mr-20 ml-20"
                                >
                                    We harness the power of artificial intelligence to break down barriers, discover new insights, and drive meaningful change for marginalized communities. Our approach combines diverse perspectives and expertise from various fields, creating solutions that are both innovative and inclusive. By integrating these interdisciplinary methods, we aim to tackle complex social issues, paving the way for a more equitable, understanding world.
                                </motion.p>
                                <motion.a 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                    href="/about" 
                                    className="inline-block bg-gray-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg text-md"
                                >
                                    Ask Bayard
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <div className="bg-gradient-to-r from-amber-200 dark:from-gray-800 to-amber-100 dark:to-gray-900 text-gray-600 dark:text-gray-400 py-4 px-6 flex items-center justify-between text-xs backdrop-filter backdrop-blur-3xl bg-opacity-20 bg-amber-100/60 dark:bg-gray-800/60 shadow-lg">
                    <div>
                        <span>© {new Date().getFullYear()} Bayard Lab. All rights reserved. Open-source use subject to <a href="https://docs.bayardlab.org/wl1.0gp-license-terms" target="_blank" rel="noopener noreferrer" className="underline text-amber-700 dark:text-amber-500 hover:text-gray-600 dark:hover:text-amber-400">terms</a>.</span>
                    </div>
                    <div>
                        <a href="https://bayardlab.org/terms" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 text-xs hover:text-gray-800 dark:hover:text-amber-500 mr-4">
                            Terms & Conditions
                        </a>
                        <a href="https://bayardlab.org/privacy-notice" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 text-xs hover:text-gray-800 dark:hover:text-amber-500">
                            Privacy Notice
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}