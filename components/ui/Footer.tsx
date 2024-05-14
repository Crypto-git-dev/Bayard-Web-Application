const Footer = () => {
    return (
        <footer>
            <div className="bg-gradient-to-r from-amber-400 dark:from-gray-800 to-amber-100 dark:to-gray-900 text-gray-600 dark:text-gray-400 py-4 px-6 flex flex-col sm:flex-row items-left justify-between text-xs backdrop-filter backdrop-blur-3xl bg-opacity-20 bg-amber-100/60 dark:bg-gray-800/60 shadow-lg">
                <div className="mb-4 sm:mb-0">
                    <span>© {new Date().getFullYear()} Bayard Lab. All rights reserved. Open-source use subject to <a href="https://docs.bayardlab.org/wl1.0gp-license-terms" target="_blank" rel="noopener noreferrer" className="underline text-gray-700 dark:text-amber-500 hover:text-gray-400 dark:hover:text-amber-300">terms</a>.</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mr-12 sm:mr-0">
                    <a href="https://bayardlab.org/terms" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 text-xs hover:text-gray-800 dark:hover:text-amber-500">
                        Terms & Conditions
                    </a>
                    <a href="https://bayardlab.org/privacy-notice" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 text-xs hover:text-gray-800 dark:hover:text-amber-500">
                        Privacy Notice
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
