'use client';

import { useState, useRef, useEffect } from "react";
import queryBayard from './api/route';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import BAYARD_LAB_YELLOW from '@/assets/bayard_lab_yellow.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Lexend_Peta } from "next/font/google";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface Message {
  user: string;
  text: string;
}

interface Document {
  title: string;
  authors: string[];
  yearPublished: string;
  abstract: string;
  downloadUrl: string;
}

interface ChatHistory {
  messages: Message[];
  documents: Document[];
}

const lexendPetaStyle = Lexend_Peta({
  weight: '800',
  style: 'normal',
  display: 'swap',
  subsets: ['latin']
});

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatHistory>({ messages: [], documents: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");



  const [modelOutput, setModelOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 220, friction: 20 },
  });

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

  const sendMessage = async () => {
    if (message.trim() === "") return;
  
    const userMessage: Message = {
      user: "You",
      text: message,
    };
  
    setChatHistory((prevChatHistory) => ({
      ...prevChatHistory,
      messages: [...prevChatHistory.messages, userMessage],
    }));
  
    setMessage("");
    setIsLoading(true);
    setLoadingStatus("Thinking...");
  
    try {
      const response = await queryBayard(message);
      setLoadingStatus("Querying...");
  
      const botMessage: Message = {
        user: "Bayard",
        text: response.model_output,
      };
  
      setChatHistory((prevChatHistory) => ({
        messages: [...prevChatHistory.messages, botMessage],
        documents: response.documents || [],
      }));
  
      setLoadingStatus("Generating...");
    } catch (error) {
      console.error("Error:", error);
    }
  
    setIsLoading(false);
    setLoadingStatus("");
  };
  
  const regenerateResponse = async () => {
    setIsLoading(true);
    setLoadingStatus("Generating...");
  
    try {
      const lastUserMessage = chatHistory.messages[chatHistory.messages.length - 2].text;
      const response = await queryBayard(lastUserMessage);
  
      const updatedChatHistory = [...chatHistory.messages.slice(0, -1)];
      const botMessage: Message = {
        user: "Bayard",
        text: response.model_output,
      };
  
      setChatHistory({
        messages: [...updatedChatHistory, botMessage],
        documents: response.documents || [],
      });
    } catch (error) {
      console.error("Error:", error);
    }
  
    setIsLoading(false);
    setLoadingStatus("");
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
    sendMessage();
  }
};

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-xs">
      <header className="bg-gray-900 text-amber-300 py-4 px-6 flex items-center justify-between shadow-md">
        <a href="https://bayardlab.org" target="_blank" rel="noopener noreferrer">
          <Image src={BAYARD_LAB_YELLOW} alt="Bayard Lab Logo" width={150} height={50} />
        </a>
        <h1 className={`${lexendPetaStyle} uppercase`}>Bayard_One</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="https://bayardlab.org" className="hover:text-amber-500">
                Home
              </a>
            </li>
            <li>
              <a href="https://www.bayardlab.org/about-bayard-one" className="hover:text-amber-500">
                About
              </a>
            </li>
            <li>
              <a href="https://docs.bayardlab.org" className="hover:text-amber-500">
                Documentation
              </a>
            </li>
            <li>
              <a href="https://www.bayardlab.org/contact" className="hover:text-amber-500">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex flex-1 overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
      <aside ref={asideRef}
          className="bg-gray-700 p-4 transition-all duration-300 overflow-y-auto shadow-lg z-10 relative"
          style={{ width: '100%', height: '100%' }} 
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-amber-300">Documents</h2>
            <div
              className="w-2 h-full bg-gray-500 hover:bg-gray-400 cursor-col-resize"
              onMouseDown={handleMouseDown}
            ></div>
          </div>
          {isLoading && (
            <div className="text-center mt-2">
              <div className="animate-pulse">
                {loadingStatus === 'Thinking...' && (
                    <div className="h-2 bg-amber-500 rounded w-1/4 mx-auto"></div>
                )}
                {loadingStatus === 'Querying...' && (
                  <div className="h-2 bg-amber-500 rounded w-1/2 mx-auto"></div>
                )}
                {loadingStatus === 'Generating...' && (
                  <div className="h-2 bg-amber-500 rounded w-3/4 mx-auto"></div>
                )}
              </div>
              <p className="mt-1 text-amber-300">{loadingStatus}</p>
            </div>
          )}
          {chatHistory.documents.length > 0 && (
            <>
              <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                {chatHistory.documents
                  .filter((doc) => doc.abstract)
                  .map((doc, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="mb-2 p-2 bg-gray-600 text-amber-300 shadow">
                        <CardHeader>
                          <CardTitle className="text-base">{doc.title}</CardTitle>
                          <CardDescription>
                            <p className="text-xs text-gray-400">
                              <strong>Authors:</strong> {doc.authors.join(", ")}
                            </p>
                            <p className="text-xs text-gray-400">
                              <strong>Year Published:</strong> {doc.yearPublished}
                            </p>
                            <p className="text-xs mt-1 text-gray-400">
                              <strong>Abstract:</strong> {doc.abstract.length > 500 ? doc.abstract.slice(0, 500) + "..." : doc.abstract}
                            </p>
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <a href={doc.downloadUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-amber-500 text-gray-800 hover:bg-amber-400">
                              Download
                            </Button>
                          </a>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
              </div>
              <div className="mt-2 flex justify-between">
                <p className="text-xs text-amber-300">
                  {chatHistory.documents.filter((doc) => doc.abstract).length} documents with abstracts
                </p>
                {chatHistory.documents.filter((doc) => !doc.abstract).length > 0 && (
                  <p className="text-xs text-amber-300">
                    {chatHistory.documents.filter((doc) => !doc.abstract).length} documents without abstracts
                  </p>
                )}
              </div>
            </>
          )}
          {chatHistory.documents.length === 0 && !isLoading && (
            <p className="text-xs text-amber-300 mt-2">No documents found</p>
          )}
        </aside>
          </ResizablePanel>
          <ResizableHandle style={{ width: '2px' }} />
          <ResizablePanel>
        <div className="w-0.5 bg-gray-600"></div>
        <section className="flex-1 flex flex-col overflow-hidden" style={{ width: '100%', height: '100%' }}>
          <div className="flex-1 p-4 bg-gray-800 overflow-y-auto">
            <AnimatePresence>
              {chatHistory.messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-2 p-2 bg-gray-700 text-amber-300 shadow-md">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={message.user === 'You' ? '/user-avatar.png' : '/bayard-avatar.png'} alt={message.user} />
                          <AvatarFallback className="text-xs">{message.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">{message.user}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-2">
                      {message.user === 'Bayard' && isStreaming && message.text === modelOutput ? (
                        <animated.p className="text-xs" style={{ ...springProps, lineHeight: '1.4' }}>
                          {streamedText}
                          <span className="animate-pulse">|</span>
                        </animated.p>
                      ) : (
                        <p className="text-xs" style={{ lineHeight: '1.4' }}>{message.text}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="text-center mt-2">
                <div className="animate-pulse">
                  {loadingStatus === 'Thinking...' && (
                    <div className="h-2 bg-amber-500 rounded w-1/4 mx-auto"></div>
                  )}
                  {loadingStatus === 'Querying...' && (
                    <div className="h-2 bg-amber-500 rounded w-1/2 mx-auto"></div>
                  )}
                  {loadingStatus === 'Generating...' && (
                    <div className="h-2 bg-amber-500 rounded w-3/4 mx-auto"></div>
                  )}
                </div>
                <p className="mt-1 text-amber-300">{loadingStatus}</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-800">
            <div className="flex space-x-2">
              <div className="flex-1 mr-2">
                <Textarea
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full px-2 py-1 bg-gray-700 text-amber-300 border-gray-60 focus:border-amber-300 shadow-md"
                  placeholder="Type your message..."
                />
              </div>
              <div className="flex flex-col space-y-2 mr-2">
                <Button onClick={sendMessage} disabled={isLoading} className="bg-amber-500 text-gray-800 hover:bg-amber-400 text-xs">
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
                <Button onClick={regenerateResponse} disabled={isLoading} variant="ghost" className="border-amber-500 text-amber-300 hover:bg-amber-500 hover:text-gray-800 text-xs">
                  Regenerate
                </Button>
              </div>
            </div>
          </div>
        </section>
        </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}