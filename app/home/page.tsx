'use client';

import { useState, useEffect, useRef } from "react";
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
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const lexendPetaStyle = Lexend_Peta({
    weight: '800',
    style: 'normal',
    subsets: ['latin']
});

export default function HomePage() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

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

    const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        const delta = event.deltaY;
        const slider = sliderRef.current;

        if (slider) {
            if (delta > 0) {
                setCurrentSlide((prevSlide) => Math.min(prevSlide + 1, cards.length - 1));
            } else {
                setCurrentSlide((prevSlide) => Math.max(prevSlide - 1, 0));
            }
        }
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            slider.scrollTo({
                left: currentSlide * window.innerWidth,
                behavior: 'smooth',
            });
        }
    }, [currentSlide]);
    const cards = [
        {
            title: "Liberating marginalized knowledge to empower communities and drive transformative change.",
            description: "At Bayard Lab, we are driven by a powerful mission: to harness the potential of technology to amplify the scholarship and knowledge of marginalized communities, fostering a more inclusive, equitable, and enlightened society. We believe that the voices, experiences, and insights of these communities are not only valuable but crucial to driving progressive change.",
            link: "/about",
            linkText: "Learn more about our work",
            image: "/assets/BAYARD_LAB.png",
        },
        {
            title: "Untethered Knowledge Drives Progressive Change",
            description: "At Bayard Lab, we believe in the power of knowledge to drive progressive change. That's why we harness the power of accessible technology to amplify the scholarship and knowledge of marginalized communities, focusing on the LGBTQIA+ community as our starting point. By leveraging AI and data analytics, we create platforms and tools that make research, studies, and insights from marginalized communities more discoverable, accessible, and impactful.",
            link: "/about",
            linkText: "Learn more about the Lab",
            image:"/assets/BAYARD_LAB.png",
        },
        {
            title: "Fostered Collaboration Drives Radical Equity",
            description: "We understand that the scholarship and knowledge of marginalized communities are often overlooked or undervalued. That's why we are committed to fostering collaboration and knowledge sharing within these communities, starting with the LGBTQIA+ community. By creating spaces and platforms for scholars, researchers, and activists to connect, collaborate, and share their work, we aim to strengthen the collective voice and impact of marginalized communities in driving progressive change.",
            link: "/community",
            linkText: "Join our burgeoning community",
            image: "/assets/BAYARD_LAB.png",
        },
        {
            title: "BAYARD_ONE",
            description: "Bayard_One is an innovative open-source retrieval-augmented generative AI assistant that aims to transform the way researchers, academics, and community members engage with LGBTQ+ scholarship. By integrating a vast collection of over 20,000 LGBTQ+ research papers, journals, and resources, Bayard_One provides a centralized platform for exploring the diverse and complex landscape of LGBTQ+ knowledge, fostering a deeper understanding of the community's experiences, challenges, and triumphs.",
            link: "/bayard-one",
            linkText: "Ask Bayard",
            image: "/assets/BAYARD_LAB.png",
        },
        {
            title: "Empowering Marginalized Voices",
            description: "At Bayard Lab, we are committed to empowering marginalized voices and amplifying their impact. We believe that by providing accessible tools and platforms for scholars, researchers, and activists from marginalized communities to share their work and collaborate, we can help drive progressive change and create a more equitable and just society. Join us in our mission to liberate knowledge and empower communities.",
            link: "/get-involved",
            linkText: "Get involved and make a difference",
            image: "/assets/BAYARD_LAB.png",
        }
    ];

    return (
        <div className="flex flex-col min-h-screen text-base bg-gray-100 dark:bg-gray-900 dark:text-base dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:bg-fixed dark:bg-opacity-100">
            <header className="bg-gradient-to-r from-amber-200 to-amber-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-amber-500 py-6 px-12 flex items-center justify-between shadow-lg backdrop-filter backdrop-blur-2xl bg-opacity-60 sticky top-0 z-50">
                <div className="flex items-center">
                    <Image
                        src={isDarkMode ? BAYARD_LAB : BAYARD_LAB_YELLOW}
                        alt="Bayard Lab Logo"
                        width={200}
                        height={50}
                        className="h-10 w-auto"
                    />
                </div>
                <div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={toggleDarkMode}
                                    className="bg-transparent text-gray-800 dark:text-amber-500 border-gray-800 dark:border-amber-500 hover:bg-gray-800 hover:text-white dark:hover:bg-amber-500 dark:hover:text-gray-900"
                                >
                                    {isDarkMode ? 'Light' : 'Dark'}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Toggle {isDarkMode ? 'light' : 'dark'} mode</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </header>

            <main className="flex-grow">
                <div
                    ref={sliderRef}
                    className="slider-container w-screen h-screen overflow-x-scroll scroll-smooth snap-x snap-mandatory"
                    onWheel={handleScroll}
                >
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="slide w-screen h-screen flex justify-center items-center snap-center"
                        >
                            <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center"
                                >
                                    <div className="md:w-1/2 mb-8 md:mb-0 md:mr-8">
                                    <Image
                                        src={card.image}
                                        alt={card.title}
                                        width={500} // Add the appropriate width
                                        height={300} // Add the appropriate height
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                                                    </div>
                                    <div className="md:w-1/2">
                                        <h2 className={`${lexendPetaStyle.className} text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800 dark:text-white`}>
                                            {card.title}
                                        </h2>
                                        <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8">
                                            {card.description}
                                        </p>
                                        <Link
                                            href={card.link}
                                            className="inline-block bg-amber-500 text-white dark:bg-amber-600 dark:text-gray-900 px-6 py-3 rounded-lg text-lg md:text-xl lg:text-2xl font-semibold hover:bg-amber-600 dark:hover:bg-amber-700 transition duration-200"
                                        >
                                            {card.linkText}
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="bg-gradient-to-r from-amber-200 to-amber-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-amber-500 py-6 px-12 flex items-center justify-between shadow-lg backdrop-filter backdrop-blur-2xl bg-opacity-60">
                <div className="flex items-center">
                    <Image
                        src={isDarkMode ? BAYARD_LAB : BAYARD_LAB_YELLOW}
                        alt="Bayard Lab Logo"
                        width={200}
                        height={50}
                        className="h-10 w-auto"
                    />
                </div>
                <div className="text-sm">
                    &copy; {new Date().getFullYear()} Bayard Lab. All rights reserved.
                </div>
            </footer>
        </div>
    );
}