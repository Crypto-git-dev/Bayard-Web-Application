'use client';

import { useState, useRef } from "react";
import queryBayard from './api/route';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from 'next/image';
import BAYARD_LAB_YELLOW from '@/assets/bayard_lab_yellow.png';

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

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatHistory>({ messages: [], documents: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const asideRef = useRef<HTMLElement>(null);

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
        user: "Assistant",
        text: response.model_output,
      };

      setChatHistory((prevChatHistory) => ({
        messages: [...prevChatHistory.messages, botMessage],
        documents: response.documents || [],
      }));
    } catch (error) {
      console.error("Error:", error);
    }

    setIsLoading(false);
    setLoadingStatus("");
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

  const regenerateResponse = async () => {
    if (chatHistory.messages.length === 0) return;

    const lastUserMessage = chatHistory.messages[chatHistory.messages.length - 2];

    setIsLoading(true);
    setLoadingStatus("Generating...");

    try {
      const response = await queryBayard(lastUserMessage.text);
      setLoadingStatus("Querying...");

      const botMessage: Message = {
        user: "Assistant",
        text: response.text,
      };

      setChatHistory((prevChatHistory) => ({
        messages: [...prevChatHistory.messages.slice(0, -1), botMessage],
        documents: response.documents || [],
      }));
    } catch (error) {
      console.error("Error:", error);
    }

    setIsLoading(false);
    setLoadingStatus("");
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (asideRef.current) {
      const newWidth = e.clientX - asideRef.current.offsetLeft;
      asideRef.current.style.width = `${newWidth}px`;
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="bg-[#6] shadow-lg py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <Image src={BAYARD_LAB_YELLOW} alt="Bayard Lab Logo" height={48} />
          </div>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <aside
          ref={asideRef}
          className="w-1/2 bg-gray-700 p-6 transition-all duration-300 overflow-y-auto shadow-lg z-10 relative"
        >
          <h2 className="text-xl font-bold mb-4 text-amber-300">Documents</h2>
          {isLoading && (
            <div className="text-center mt-4">
              <div className="animate-pulse">
                {loadingStatus === 'Thinking...' && (
                  <div className="h-4 bg-amber-500 rounded w-1/4 mx-auto"></div>
                )}
                {loadingStatus === 'Searching...' && (
                  <div className="h-4 bg-amber-500 rounded w-1/2 mx-auto"></div>
                )}
              </div>
              <p className="mt-2 text-amber-300">{loadingStatus}</p>
            </div>
          )}
          <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
            {chatHistory.documents
              .filter((doc) => doc.abstract)
              .map((doc, index) => (
                <Card key={index} className="mb-4 p-4 bg-gray-600 text-amber-300">
                  <CardHeader>
                    <CardTitle>{doc.title}</CardTitle>
                    <CardDescription>
                      <p className="text-gray-300">
                        <strong>Authors:</strong> {doc.authors.join(", ")}
                      </p>
                      <p className="text-gray-300">
                        <strong>Year Published:</strong> {doc.yearPublished}
                      </p>
                      <p className="text-gray-300 mt-2">
                        <strong>Abstract:</strong> {doc.abstract}
                      </p>
                    </CardDescription>
                  </CardHeader>
                  <div className="mt-4">
                    <Button asChild className="px-4 py-2 bg-amber-500 text-gray-800 hover:bg-amber-400">
                      <a href={doc.downloadUrl} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
          <p className="mt-4 italic text-gray-400">
            {chatHistory.documents.length - chatHistory.documents.filter((doc) => doc.abstract).length} documents without abstracts omitted from search results.
          </p>
          <div
            className="absolute top-0 right-0 bottom-0 w-1 bg-amber-500 cursor-col-resize"
            onMouseDown={handleMouseDown}
          ></div>
        </aside>
        <section className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 bg-gray-800 overflow-y-auto">
            {chatHistory.messages.map((message, index) => (
              <div
              key={index}
              className={`mb-4 ${message.user === 'You' ? 'text-right' : 'text-left'} ${
                message.user === 'You' ? 'text-amber-300' : 'text-gray-300'
              }`}
              style={{ lineHeight: '1.6' }}
            >
              <strong>{message.user}:</strong> {message.text}
            </div>
          ))}
          {isLoading && (
            <div className="text-center mt-4">
              <div className="animate-pulse">
                {loadingStatus === 'Thinking...' && (
                  <div className="h-4 bg-amber-500 rounded w-1/4 mx-auto"></div>
                )}
                {loadingStatus === 'Querying...' && (
                  <div className="h-4 bg-amber-500 rounded w-1/2 mx-auto"></div>
                )}
                {loadingStatus === 'Generating...' && (
                  <div className="h-4 bg-amber-500 rounded w-3/4 mx-auto"></div>
                )}
              </div>
              <p className="mt-2 text-amber-300">{loadingStatus}</p>
            </div>
          )}
        </div>
        <div className="p-6 bg-gray-800">
          <div className="flex space-x-2">
            <div className="flex-1 mr-5">
              <Textarea
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full px-2 bg-gray-700 text-amber-300 border-gray-600 focus:border-amber-300"
                placeholder="Type your message..."
              />
            </div>
            <div className="flex flex-col space-y-2 mr-5">
              <Button onClick={sendMessage} disabled={isLoading} className="bg-amber-500 text-gray-800 hover:bg-amber-400">
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
              <Button onClick={regenerateResponse} disabled={isLoading} variant="ghost" className="border-amber-500 text-amber-300 hover:bg-amber-500 hover:text-gray-800">
                Regenerate
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);
}