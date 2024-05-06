'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import BAYARD_LAB_YELLOW from '@/assets/BAYARD_LAB_YELLOW.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Lexend_Peta } from "next/font/google";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { toast, Toaster } from 'react-hot-toast';

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

interface ChatHistory {
  messages: Message[];
  documents: Document[];
}

const lexendPetaStyle = Lexend_Peta({
  weight: '800',
  style: 'normal',
  subsets: ['latin']
});

function formatMessage(message: string): string {
  return message.replace(/\n/g, '<br>');
}

async function sendMessage(message: string) {
  const response = await fetch('/api/bayard-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input_text: message }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const data = await response.json();
  return data;
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatHistory>({ messages: [], documents: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);



  const [modelOutput, setModelOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 220, friction: 20 },
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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

  const sendMessage = async () => {
    if (message.trim() === '') return;
  
    const userMessage: Message = {
      user: 'You',
      text: message,
      timestamp: new Date().toLocaleString(), // Add timestamp
    };

    setChatHistory((prevChatHistory) => ({
      ...prevChatHistory,
      messages: [...prevChatHistory.messages, userMessage],
    }));
  
    setMessage('');
    setIsLoading(true);
    setLoadingStatus('Thinking...');
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate thinking delay
      setLoadingStatus('Querying...');
  
      const response = await fetch('/api/bayard-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: message }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate querying delay
      setLoadingStatus('Generating...');
  
      const data = await response.json();
      const botMessage: Message = {
        user: 'Bayard',
        text: data.model_output,
        timestamp: new Date().toLocaleString(), // Add timestamp
      };

  
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate generating delay
  
      setChatHistory((prevChatHistory) => ({
        messages: [...prevChatHistory.messages, botMessage],
        documents: data.documents || [],
      }));
    } catch (error) {
      console.error('Error:', error);
    }
  
    setIsLoading(false);
    setLoadingStatus('');
  };
  
  const regenerateResponse = async () => {
    setIsLoading(true);
    setLoadingStatus('Generating...');
  
    try {
      const lastUserMessage = chatHistory.messages[chatHistory.messages.length - 2].text;
      await sendMessage(); // Remove the argument from the function call
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
    sendMessage();
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
      icon: '❕',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });  }
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
    <div className="flex flex-col h-screen bg-gray-900 text-base">
      <header className="bg-gray-900 text-amber-500 py-4 px-6 flex items-center justify-between shadow-lg">
        <a href="https://bayardlab.org" target="_blank" rel="noopener noreferrer">
          <Image src={BAYARD_LAB_YELLOW} alt="Bayard Lab Logo" width={150} height={50} />
        </a>
        <h1 className={`${lexendPetaStyle.className} uppercase text-md`}>Bayard_One</h1>        
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
          className="bg-gray-700 p-4 pl-10 pr-10 transition-all duration-300 overflow-y-auto shadow-lg z-10 relative"
          style={{ width: '100%', height: '100%' }} 
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-amber-400 mb-3">Documents</h2>
            <div
              className="w-2 h-full bg-gray-500 hover:bg-gray-400 cursor-col-resize"
              onMouseDown={handleMouseDown}
            ></div>
          </div>
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
                      <Card className="mb-2 p-2 bg-gray-600 text-amber-400 shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl">{doc.title}</CardTitle>
                          <CardDescription>
                            <p className="mt-2 text-xs text-gray-300">
                              <strong>Authors:</strong> {doc.authors.join(", ")}
                            </p>
                            <p className="mt-2 text-xs text-gray-300">
                              <strong>Year Published:</strong> {doc.yearPublished}
                            </p>
                            <p className="mt-5 text-s mt-1 text-gray-300">
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
        <div className="w-0.5 bg-gray-60"></div>
        <section className="flex-1 flex flex-col overflow-hidden" style={{ width: '100%', height: '100%' }}>
          <div className="flex items-center justify-between p-4 pr-10 pl-10 bg-gray-800 text-amber-400">
            <h2 className="text-lg font-semibold">Chat</h2>
          </div>
          <div ref={chatContainerRef} className="flex-1 p-4 pr-10 pl-10 bg-gray-800 overflow-y-auto">
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
  className={`mb-2 p-2 ${
    message.user === 'You' ? 'bg-gray-900 text-amber-400' : 'bg-gray-700 text-amber-300 shadow-md'
  }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-slate-500">{message.user.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{message.user}</p>
                <p className="text-xs text-gray-100">{message.timestamp}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className="text-xs text-amber-400 hover:text-amber-300"
                onClick={() => copyToClipboard(message.text)}
              >
                Copy
              </button>
              <button
                className="text-xs text-amber-400 hover:text-amber-300"
                onClick={() => shareMessage(message.text)}
              >
                Share
              </button>
              {message.user === 'Bayard' && (
                <button
                  className="text-xs text-amber-400 hover:text-amber-300"
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
                ) : (
                  <div
                    className="text-sm text-amber-400"
                    style={{ lineHeight: '1.6' }}
                    dangerouslySetInnerHTML={{ __html: message.user === 'Bayard' ? formatMessage(message.text) : message.text }}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
</AnimatePresence>
            {isLoading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                <div className="text-center w-1/2">
                  <div className="flex justify-center w-full">
                    <div className="w-full bg-gray-500 rounded h-4">
                      <div
                        className={`h-4 rounded  ${
                          loadingStatus === 'Thinking...' ? 'w-1/3' :
                          loadingStatus === 'Querying...' ? 'w-2/3' :
                          loadingStatus === 'Generating...' ? 'w-full' : ''
                        } bg-amber-500 transition-all duration-500`}
                      >
                        <div className="h-4 bg-gray-500 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-1 text-amber-300 text-lg">{loadingStatus}</p>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-900">
            <div className="flex space-x-2">
              <div className="flex-1 mr-2">
                <Textarea
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full px-2 py-2  bg-gray-700 text-amber-300 border-gray-60 focus:border-amber-300 shadow-md"
                  placeholder="What would you like to ask Bayard?"
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