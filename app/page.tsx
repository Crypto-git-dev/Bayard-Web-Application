'use client';

import { useState, useRef, useEffect } from "react";
import Header from '@/components/ui/Header';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import BAYARD_LAB_YELLOW from '@/assets/BAYARD_LAB_YELLOW.png';
import BAYARD_LAB from '@/assets/BAYARD_LAB.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Lexend_Peta } from "next/font/google";
import { ToastIcon } from 'react-hot-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as amplitude from '@amplitude/analytics-browser';
import { autocapturePlugin } from '@amplitude/plugin-autocapture-browser';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BAYARD_AVATAR from '@/assets/noun-squirrel-2777144.png';
import rehypeRaw from 'rehype-raw'
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import PromptSuggestions from "@/components/ui/PromptSuggestions";
import BetaBanner from "@/components/ui/Beta";
import Footer from "@/components/ui/Footer";
import MobilePage from "./MobilePage";
import { useSearchParams } from 'next/navigation';
import { useCallback } from "react";


const apiKey = process.env.AMPLITUDE_API_KEY || ""; // Set a default value if the API key is undefined
amplitude.init(apiKey);
amplitude.add(autocapturePlugin());


interface Message {
  user: string;
  text: string;
  timestamp: string;
}

interface Document {
  title: string;
  authors: string[];
  yearPublished: string;
  abstract: string;
  downloadUrl: string;
}


interface DocumentTab {
  id: string;
  title: string;
  documents: Document[];
}

interface ChatHistory {
  messages: Message[];
  documentTabs: DocumentTab[];
}

interface FormattedModelOutputProps {
  text: string;
  documentTabs: DocumentTab[];
  activeTabId: string | null;
}


const lexendPetaStyle = Lexend_Peta({
  weight: '800',
  style: 'normal',
  subsets: ['latin']
});


function FormattedModelOutput({ text, documentTabs, activeTabId }: FormattedModelOutputProps) {
  function handleDocumentClick(e: React.MouseEvent<HTMLAnchorElement>, index: number) {
    e.preventDefault();
    const documentCard = document.getElementById(`doc-${index}`);
    if (documentCard) {
      documentCard.scrollIntoView({ behavior: 'smooth' });
      documentCard.classList.add('glow');
      setTimeout(() => {
        documentCard.classList.remove('glow');
      }, 4000);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLinkUrl, setModalLinkUrl] = useState('');

  const handleExternalLinkClick = (event: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const linkUrl = event.currentTarget.href;
    setIsModalOpen(true);
    setModalLinkUrl(linkUrl);
  };


  const [isDarkMode, setIsDarkMode] = useState(false);

  const formattedText = text.replace(/Document (\d+)|\[|\]/g, (match, index) => {
    if (match === '[' || match === ']') {
      return '';
    }
    const documentIndex = parseInt(index, 10) - 1;
    return `<a href="#doc-${documentIndex}" class="document-link" data-index="${documentIndex}">${match}</a>`;
  });

  useEffect(() => {
    const downloadLinks = document.querySelectorAll('a[href^="https://"]');
    downloadLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const linkUrl = link.getAttribute('href');
        if (linkUrl) {
          setIsModalOpen(true);
          setModalLinkUrl(linkUrl);
        }
      });
    });
  }, [formattedText]);

  return (
    <div>
      <ReactMarkdown
        className="text-sm text-gray-800 dark:text-amber-400 prose prose-sm max-w-none"
        components={{
          p: ({ node, ...props }) => <p style={{ marginBottom: '1rem' }} {...props} />,
          ul: ({ node, ...props }) => <ul style={{ marginBottom: '1rem' }} {...props} />,
          ol: ({ node, ...props }) => <ol style={{ marginBottom: '1rem' }} {...props} />,
          li: ({ node, ...props }) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
          pre: ({ node, ...props }) => <pre style={{ marginBottom: '1rem' }} {...props} />,
          code: ({ node, ...props }) => <code style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: '0.2rem 0.4rem', borderRadius: '3px' }} {...props} />,
          strong: ({ node, ...props }) => <strong style={{ marginBottom: '0.5rem' }} {...props} />,
          blockquote: ({ node, ...props }) => <blockquote style={{ marginBottom: '1rem' }} {...props} />,
          a: ({ node, ...props }) => (
            <a
              href={props.href}
              onClick={(e) => {
                if (props.href?.startsWith('#doc-')) {
                  const index = parseInt(props.href.slice(5), 10);
                  handleDocumentClick(e as React.MouseEvent<HTMLAnchorElement>, index);
                } else if (props.href?.startsWith('https://')) {
                  handleExternalLinkClick(e as React.MouseEvent<HTMLAnchorElement>);
                }
              }}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              style={{ marginBottom: '1rem' }}
              {...props}
            />
          ),
          h1: ({ node, ...props }) => <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', marginBottom: '1rem' }} {...props} />,
          h2: ({ node, ...props }) => <h2 style={{ fontSize: '2.2em', fontWeight: 'bold', marginBottom: '1rem' }} {...props} />,
          h3: ({ node, ...props }) => <h3 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '1rem' }} {...props} />,
          h4: ({ node, ...props }) => <h4 style={{ fontSize: '1.35em', fontWeight: 'bold', marginBottom: '1rem' }} {...props} />,
          h5: ({ node, ...props }) => <h5 style={{ fontSize: '1em', fontWeight: 'bold', marginBottom: '1rem' }} {...props} />,
          h6: ({ node, ...props }) => <h6 style={{ fontSize: '1em', fontWeight: 'bold', marginBottom: '1rem' }} {...props} />,
          em: ({ node, ...props }) => <em {...props} />,
          table: ({ node, ...props }) => <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '1rem' }} {...props} />,
          thead: ({ node, ...props }) => <thead {...props} />,
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr: ({ node, ...props }) => <tr {...props} />,
          th: ({ node, ...props }) => <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }} {...props} />,
          td: ({ node, ...props }) => <td style={{ border: '1px solid #ddd', padding: '8px' }} {...props} />,
          hr: ({ node, ...props }) => <hr style={{ marginBottom: '1rem' }} {...props} />,
        }}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {formattedText}
      </ReactMarkdown>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onAfterOpen={() => {
          const progressBar = document.querySelector('.progress-bar') as HTMLElement;
          if (progressBar) {
            progressBar.style.animation = 'none';
            setTimeout(() => {
              progressBar.style.animation = 'countdown 5s linear forwards';
            }, 100);
          }
        }}
        contentLabel="You are leaving Bayard_One..."
        className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-0"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">You are being redirected...</h2>
          <p className="text-gray-700 dark:text-amber-300 mb-8 leading-7">
            Bayard Lab&apos;s mission is to promote the accessibility of scholarship and knowledge pertaining to LGBTQIA+ and other marginalized communities.<br /><br />
            However, we do not have editorial control over the content of external resources. We encourage users to critically evaluate the information found through these links using their own discretion and judgment.
          </p>

          <div className="relative h-2 bg-gray-300 rounded-full mb-12">
            <div
              className="progress-bar absolute top-0 left-0 right-0 h-2 bg-amber-500 rounded-full"
              onAnimationEnd={() => {
                setIsModalOpen(false);
                window.open(modalLinkUrl, '_blank');
              }}
            >
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                setIsModalOpen(false);
                window.open(modalLinkUrl, '_blank');
              }}
              className="px-6 py-3 text-base font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-500 dark:focus:ring-offset-gray-800 dark:text-gray-800"
            >
              Proceed
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
              }}
              className="px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:text-amber-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-amber-500 dark:focus:ring-offset-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatHistory>({ messages: [], documentTabs: [] }); const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [modelOutput, setModelOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('q') || '';
  const searchQueryRef = useRef('');

  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 220, friction: 20 },
  });

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLinkUrl, setModalLinkUrl] = useState('');

  const handleExternalLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const linkUrl = event.currentTarget.href;
    setIsModalOpen(true);
    setModalLinkUrl(linkUrl);
  };

  const handleExternalLinkTouchEnd = (event: React.TouchEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const linkUrl = event.currentTarget.href;
    setIsModalOpen(true);
    setModalLinkUrl(linkUrl);
  };

  useEffect(() => {
    // Reset the modal state when the screen size changes
    setIsModalOpen(false);
    setModalLinkUrl('');
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePromptSelect = (prompt: string) => {
    setMessage(prompt);
    setIsPromptModalOpen(false);
  };

  useEffect(() => {
    // Check if the user has a preferred color scheme
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);

    // Apply dark mode class to body element
    document.body.classList.toggle('dark', prefersDarkMode);
  }, []);

  const toggleDarkMode = () => {
    console.log('toggleDarkMode called');
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    document.body.classList.toggle('dark', newIsDarkMode);
  };


  useEffect(() => {
    if (chatContainerRef.current) {
      const lastMessage = chatContainerRef.current.lastElementChild;
      if (lastMessage) {
        const buffer = 20; // Adjust the buffer value as needed
        const containerRect = chatContainerRef.current.getBoundingClientRect();
        const lastMessageRect = lastMessage.getBoundingClientRect();
        const scrollTop = lastMessageRect.top - containerRect.top - buffer;

        chatContainerRef.current.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      }
    }
  }, [chatHistory.messages]);
  useEffect(() => {
    if (isStreaming) {
      const timer = setTimeout(() => {
        setStreamedText((prevText) => {
          const newText = modelOutput.slice(0, prevText.length + 1);
          if (newText === modelOutput) {
            setIsStreaming(false);
          }
          return newText;
        });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isStreaming, modelOutput, streamedText]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (messageText.trim() === '') return;

    const userMessage: Message = {
      user: 'You',
      text: messageText,
      timestamp: new Date().toLocaleString(),
    };

    setChatHistory((prevChatHistory) => ({
      ...prevChatHistory,
      messages: [...prevChatHistory.messages, userMessage],
    }));

    setMessage('');
    setIsLoading(true);
    setLoadingStatus('Thinking...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoadingStatus('Querying...');

      const response = await fetch('/api/bayard-proxy/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: messageText, documentTabs: chatHistory.documentTabs }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      const botMessage: Message = {
        user: 'Bayard',
        text: data.model_output,
        timestamp: new Date().toLocaleString(),
      };

      setChatHistory((prevChatHistory) => ({
        messages: [...prevChatHistory.messages, botMessage],
        documentTabs: data.documentTabs,
      }));

      setActiveTabId(data.documentTabs[data.documentTabs.length - 1].id);
    } catch (error) {
      console.error('Error:', error);
    }

    setIsLoading(false);
    setLoadingStatus('');
  }, [chatHistory.documentTabs]);

  useEffect(() => {
    if (searchQuery && searchQuery !== searchQueryRef.current) {
      searchQueryRef.current = searchQuery;
      setMessage(searchQuery);
      sendMessage(searchQuery);
    }
  }, [searchQuery, sendMessage]);


  const regenerateResponse = async () => {
    setIsLoading(true);
    setLoadingStatus('Generating...');

    try {
      const lastUserMessage = chatHistory.messages[chatHistory.messages.length - 1].text;

      // Create a new message object with the last user message
      const message: Message = {
        user: 'You',
        text: lastUserMessage,
        timestamp: new Date().toLocaleString(),
      };

      // Add the message to the chat history
      setChatHistory((prevChatHistory) => ({
        ...prevChatHistory,
        messages: [...prevChatHistory.messages, message],
      }));

      // Send the message to the backend for processing
      await sendMessage(message.text); // Pass the message text as an argument
    } catch (error) {
      console.error('Error:', error);
    }

    setIsLoading(false);
    setLoadingStatus('');
  };

  const [asideWidth, setAsideWidth] = useState(400);
  const asideRef = useRef<HTMLElement>(null);


  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (asideRef.current) {
      asideRef.current.style.transition = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (asideRef.current) {
      const newWidth = e.clientX;
      asideRef.current.style.width = `${newWidth}px`;
    }
  };

  const handleMouseUp = () => {
    if (asideRef.current) {
      asideRef.current.style.transition = "width 0.3s ease-in-out";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(message); // Pass the 'message' argument to the 'sendMessage' function
    }
  };

  const DETAILS_TIMEOUT = 10000; // 10 seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      closeDetails();
    }, DETAILS_TIMEOUT);

    const detailsElement = document.querySelector('details');
    if (detailsElement) {
      detailsElement.addEventListener('toggle', handleDetailsToggle);
    }

    return () => {
      clearTimeout(timer);
      if (detailsElement) {
        detailsElement.removeEventListener('toggle', handleDetailsToggle);
      }
    };
  }, []);

  const closeDetails = (): void => {
    document.querySelector('details')?.removeAttribute('open');
    const svgElement = document.querySelector('details summary svg:last-child') as SVGElement;
    if (svgElement) {
      svgElement.style.transform = 'rotate(-90deg)';
    }
  };

  const handleDetailsToggle = (): void => {
    const svgElement = document.querySelector('details summary svg:last-child') as SVGElement;
    if (svgElement) {
      svgElement.style.transition = 'transform 0.5s ease-in-out';
      svgElement.style.transform = document.querySelector('details')?.hasAttribute('open')
        ? 'rotate(0deg)'
        : 'rotate(-90deg)';
    }
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show a success message or toast notification
      toast.success('Message copied to clipboard');
    }).catch((error) => {
      console.error('Failed to copy message:', error);
      // Show an error message or toast notification
      toast.error('Failed to copy message');
    });
  };

  const shareMessage = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Bayard Chat Message',
        text: text,
      }).then(() => {
        // Sharing successful
        toast.success('Message shared successfully');
      }).catch((error) => {
        console.error('Failed to share message:', error);
        // Fallback to a custom share dialog or message
        toast.error('Failed to share message');
      });
    } else {
      // Fallback to a custom share dialog or message
      toast('Sharing not supported', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  const provideFeedback = (message: Message) => {
    // Open a modal or dialog to collect feedback
    const feedback = prompt('Please provide your feedback for this message:', '');

    if (feedback !== null) {
      // Send the feedback to the server or perform any necessary actions
      console.log('Feedback submitted:', feedback);
      // Show a success message or toast notification
      toast.success('Feedback submitted successfully');
    }
  };


  return (
    <>
      {isMobile ? (
        <MobilePage />
      ) : (
        <div className="flex flex-col h-screen text-base bg-gray-100 dark:bg-gray-900 dark:text-base dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:bg-fixed dark:bg-opacity-100">
      <Header />
      <div>
        <BetaBanner />
      </div>
      <main className="flex-1 overflow-y-auto">
        <ResizablePanelGroup direction="horizontal">
          {!isMobile && (
            <>
              <ResizablePanel className="shadow-md" style={{ order: 2 }}>
                <aside
                  ref={asideRef}
                  className="bg-amber-50 dark:bg-gray-700 p-4 pl-10 pr-10 transition-all duration-300 overflow-y-auto shadow-lg z-10 relative h-full"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 dark:text-amber-400 mb-3">Documents</h2>
                      <div className="relative inline-block text-left">
                        <div>
                          <button
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-amber-500"
                            id="options-menu"
                            aria-haspopup="true"
                            aria-expanded={isDropdownOpen}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          >
                            {activeTabId
                              ? chatHistory.documentTabs.find((tab) => tab.id === activeTabId)?.title.replace(/^["']|["']$/g, '')
                              : 'Select a document set'}
                            <svg
                              className="-mr-1 ml-2 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>

                        {isDropdownOpen && (
                          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                            <div
                              className="py-1"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="options-menu"
                            >
                              {chatHistory.documentTabs.map((tab) => (
                                <button
                                  key={tab.id}
                                  className={`${activeTabId === tab.id
                                    ? 'bg-amber-100 dark:bg-gray-700 text-gray-900 dark:text-amber-400'
                                    : 'text-gray-700 dark:text-amber-400'
                                    } block px-4 py-2 text-sm w-full text-left`}
                                  role="menuitem"
                                  onClick={() => {
                                    setActiveTabId(tab.id);
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  {tab.title.replace(/^["']|["']$/g, '')}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className="w-2 h-full bg-amber-300 dark:bg-gray-500 hover:bg-amber-400 dark:hover:bg-gray-400 cursor-col-resize"
                      onMouseDown={handleMouseDown}
                    ></div>
                  </div>
                  {activeTabId && (
                    <div className="space-y-4">
                      {chatHistory.documentTabs
                        .find((tab) => tab.id === activeTabId)
                        ?.documents.map((doc, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            data-document-index={index}
                            id={`doc-${index}`}
                          >
                            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4 glow">
                              <h3 className="text-xl font-semibold text-gray-800 dark:text-amber-400 mb-2 capitalize">
                                {doc.title}
                              </h3>
                              <div className="text-sm text-gray-600 dark:text-amber-300 mb-2">
                                <p><strong>Authors</strong></p>
                                {doc.authors.map((author, index) => (
                                  <p key={index}>{author}</p>
                                ))}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-amber-300 mb-2">
                                <p><strong>Year Published</strong></p>
                                <p>{doc.yearPublished}</p>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-amber-300 mb-2">
                                <p><strong>Abstract</strong></p>
                                <p>{doc.abstract.length > 500 ? doc.abstract.slice(0, 500) + '...' : doc.abstract}</p>
                              </div>            <div className="mt-4">
                                <div className="mt-4">
                                  <a
                                    href={doc.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 text-sm font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setIsModalOpen(true);
                                      setModalLinkUrl(doc.downloadUrl);
                                    }}
                                  >
                                    <span className="inline-flex items-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                      </svg>
                                      Download
                                    </span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  )}
                  {!activeTabId && chatHistory.documentTabs.length > 0 && (
                    <p className="text-xs text-gray-600 dark:text-amber-300 mt-2">Select a tab to view documents</p>
                  )}
                  {chatHistory.documentTabs.length === 0 && !isLoading && (
                    <p className="text-xs text-gray-600 dark:text-amber-300 mt-2">No documents found</p>
                  )}
                </aside>
              </ResizablePanel>
              <ResizableHandle style={{ width: '2px', order: 1 }} />
            </>
          )}
          <ResizablePanel className="shadow-md" style={{ order: 0 }}>
            <div className="w-0.5 bg-amber-200 dark:bg-gray-600"></div>
            <section className="flex-1 flex flex-col overflow-hidden" style={{ width: '100%', height: '100%' }}>
              <div className="flex items-center justify-between p-4 pr-10 pl-10 bg-amber-50 dark:bg-gray-800 text-gray-800 dark:text-amber-400">
                <h2 className="text-lg font-semibold hidden sm:block">Chat</h2>
              </div>
              <div ref={chatContainerRef} className="flex-1 p-4 pr-10 pl-10 bg-amber-50 dark:bg-gray-800 overflow-y-auto">
                {chatHistory.messages.length === 0 ? (
                  <PromptSuggestions onPromptSelect={handlePromptSelect}></PromptSuggestions>
                ) : (
                  <AnimatePresence>
                    {chatHistory.messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          className={`mb-4 p-4 rounded-lg shadow-md backdrop-filter backdrop-blur-2xl bg-opacity-30 ${message.user === 'You'
                            ? 'bg-amber-100/70 dark:bg-gray-700/70 text-gray-800 dark:text-amber-500'
                            : 'bg-amber-300/70 dark:bg-gray-900/70 text-gray-800 dark:text-amber-500'
                            }`}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {message.user === 'You' ? (
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs bg-slate-500">
                                      {message.user.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <Image
                                    src={BAYARD_AVATAR}
                                    alt="Bayard Avatar"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6 rounded-full"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-semibold">{message.user}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-100">
                                    {message.timestamp}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  className="text-xs text-gray-600 dark:text-amber-400 hover:text-gray-800 dark:hover:text-amber-300"
                                  onClick={() => copyToClipboard(message.text)}
                                >
                                  Copy
                                </button>
                                <button
                                  className="text-xs text-gray-600 dark:text-amber-400 hover:text-gray-800 dark:hover:text-amber-300"
                                  onClick={() => shareMessage(message.text)}
                                >
                                  Share
                                </button>
                                {message.user === 'Bayard' && (
                                  <button
                                    className="text-xs text-gray-600 dark:text-amber-400 hover:text-gray-800 dark:hover:text-amber-300"
                                    onClick={() => provideFeedback(message)}
                                  >
                                    Feedback
                                  </button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="mt-2">
                            {message.user === 'Bayard' && isStreaming && message.text === modelOutput ? (
                              <animated.p className="text-xs" style={{ ...springProps, lineHeight: '1.4' }}>
                                {streamedText}
                                <span className="animate-pulse">|</span>
                              </animated.p>
                            ) : message.user === 'Bayard' ? (
                              <FormattedModelOutput
                                text={message.text}
                                documentTabs={chatHistory.documentTabs}
                                activeTabId={activeTabId}
                              />
                            ) : (
                              <ReactMarkdown
                                className="text-sm text-gray-800 dark:text-amber-400 prose prose-sm max-w-none"
                                remarkPlugins={[remarkGfm]}
                              >
                                {message.text}
                              </ReactMarkdown>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.97 }}
                    transition={{ duration: 0.1 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 dark:bg-opacity-70"
                  >
                    <div className="text-center w-1/2">
                      <div className="relative">
                        <div className="w-full h-2 bg-gray-300 rounded-full">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${loadingStatus === 'Thinking...' ? '33%' : loadingStatus === 'Querying...' ? '66%' : '100%'}` }}
                            transition={{ duration: 0.1, ease: 'easeOut' }}
                            className="absolute top-0 left-0 h-2 bg-amber-500 rounded-full"
                          />
                        </div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                          className="absolute top-0 left-0 w-full h-2 bg-white rounded-full opacity-25"
                        />
                      </div>
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1, delay: 0.1 }}
                        className="mt-1 text-amber-300 dark:text-amber-300 text-lg"
                      >
                        {loadingStatus}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-200 dark:from-gray-800 to-amber-100 dark:to-gray-900 backdrop-filter backdrop-blur-md bg-opacity-30">
                <div className="flex space-x-2">
                  <div className="flex-1 mr-2">
                    <Textarea
                      value={message}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-3 bg-amber-50 dark:bg-gray-700 text-gray-800 dark:text-amber-300 border border-amber-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                      placeholder="Search over 20,000 LGBTQ+ research documents with Bayard..."
                    />
                  </div>
                  <div className="flex flex-col space-y-2 mr-2">
                    <Button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => sendMessage(message)}
                      disabled={isLoading}
                      className="relative flex items-center justify-center mt-2 w-16 h-16 rounded-full bg-gray-800 text-amber-100 dark:bg-amber-500 dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-amber-600 font-bold group transition-colors duration-300"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-6 h-6 animate-spin"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6m0 0v6" />
                          </svg>
                        </span>
                      ) : (
                        <span className="relative flex items-center justify-center">
                          <span className="w-2 h-2 border-t-2 border-r-2 border-amber-100 dark:border-gray-900 transform -rotate-45 transition-transform duration-300 ease-in-out group-hover:scale-110"></span>
                        </span>
                      )}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block mb-2 transition-opacity duration-300 ease-in-out">
                              <span className="bg-gray-800 text-amber-100 dark:bg-amber-500 dark:text-gray-900 px-2 py-1 rounded text-xs whitespace-nowrap">
                                {isLoading ? 'Sending...' : 'Send'}
                              </span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <span className="bg-gray-800 text-amber-100 dark:bg-amber-500 dark:text-gray-900 px-2 py-1 rounded text-xs whitespace-nowrap">
                              {isLoading ? 'Sending...' : 'Send'}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center bg-gray-800">
                {isMobile && (
                  <div className="flex flex-col items-center bg-gray-800 w-full ">
                    <button
                      onClick={toggleDrawer}
                      className="px-6 py-3 bg-gray-800 dark:bg-amber-500 text-white dark:text-gray-800 shadow-lg w-full"
                      style={{ position: 'relative', zIndex: 60 }}
                    >
                      {isDrawerOpen ? (
                        <div className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span>Close Documents Pane</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center z-9999">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span>Open Documents Pane</span>
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </section>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <div className="sticky bottom-0">
        <Footer />
      </div>
      {/* Drawer component on mobile devices */}
      {isMobile && isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-gradient-to-r from-amber-200 dark:from-gray-800 to-amber-100 dark:to-gray-900"
          style={{ height: 'calc(100% - 128px)' }}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-amber-300 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-amber-400">Documents</h2>
                <button
                  onClick={toggleDrawer}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-amber-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-amber-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-amber-50 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-100 dark:focus:ring-offset-gray-800 focus:ring-amber-500 mt-5"
                        id="options-menu"
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        {activeTabId
                          ? chatHistory.documentTabs.find((tab) => tab.id === activeTabId)?.title.replace(/^["']|["']$/g, '')
                          : 'Select a document set'}
                        <svg
                          className="-mr-1 ml-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    {isDropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-amber-50 dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          {chatHistory.documentTabs.map((tab) => (
                            <button
                              key={tab.id}
                              className={`${activeTabId === tab.id
                                ? 'bg-amber-100 dark:bg-gray-600 text-gray-900 dark:text-amber-400'
                                : 'text-gray-700 dark:text-amber-400'
                                } block px-4 py-2 text-sm w-full text-left`}
                              role="menuitem"
                              onClick={() => {
                                setActiveTabId(tab.id);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {tab.title.replace(/^["']|["']$/g, '')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {activeTabId && (
                  <div className="space-y-4">
                    {chatHistory.documentTabs
                      .find((tab) => tab.id === activeTabId)
                      ?.documents.map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          data-document-index={index}
                          id={`doc-${index}`}
                        >
                          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4 glow">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-amber-400 mb-2 capitalize">
                              {doc.title}
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-amber-300 mb-2">
                              <p><strong>Authors</strong></p>
                              {doc.authors.map((author, index) => (
                                <p key={index}>{author}</p>
                              ))}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-amber-300 mb-2">
                              <p><strong>Year Published</strong></p>
                              <p>{doc.yearPublished}</p>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-amber-300 mb-2">
                              <p><strong>Abstract</strong></p>
                              <p>{doc.abstract.length > 500 ? doc.abstract.slice(0, 500) + '...' : doc.abstract}</p>
                            </div>
                            <div className="mt-4">
                              <a
                                href={doc.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-4 py-2 text-sm font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                onClick={(e) => {
                                  if (!isMobile) {
                                    e.preventDefault();
                                    setIsModalOpen(true);
                                    setModalLinkUrl(doc.downloadUrl);
                                  }
                                }}
                              >
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="inline-flex items-center">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4 mr-1"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                          />
                                        </svg>
                                        Download
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Redirects to an external resource.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
                {!activeTabId && chatHistory.documentTabs.length > 0 && (
                  <p className="text-xs text-gray-600 dark:text-amber-300 mt-2">Select a tab to view documents</p>
                )}
                {chatHistory.documentTabs.length === 0 && !isLoading && (
                  <p className="text-xs text-gray-600 dark:text-amber-300 mt-2">No documents found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
      )}
    </>
  );
}

