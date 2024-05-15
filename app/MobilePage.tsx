import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Squirrel from '@/assets/noun-squirrel-2777144.png';
import { isMobile } from 'react-device-detect';

const MobilePage: React.FC = () => {

    return (
        <div className="min-h-screen bg-gradient-to-r from-amber-400 to-amber-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-8">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <Image
                    src={Squirrel}
                    alt="Logo"
                    width={100}
                    height={100}
                    className="mx-auto mb-6"
                />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-amber-400 mb-4">
                    Bayard_One is currently optimized for desktop. 
                </h1>
                <p className="text-gray-600 dark:text-amber-300 mb-6">
                    For an optimal experience, we recommend using a desktop computer and a wider screen.<br /><br />
                    <Link href="/about-bayard-one">
                    <button className="mt-4 text-sm font-bold px-4 py-2  text-gray-800 bg-amber-500 rounded hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                        Learn more about Bayard_One
                    </button>
                    </Link>
                </p>
                <div className="flex justify-center space-x-4">
                </div>
            </div>
        </div>
    );
};

export default MobilePage;