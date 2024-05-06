'use client';

import { useState } from "react";
import queryBayard from './api/route';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";


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
      setLoadingStatus("Searching...");

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
      setLoadingStatus("Searching...");

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

  return (
    <div className="flex flex-col h-screen">
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center font-lexend-peta-700">BAYARD_ONE</h1>
      </div>
    </header>
    <main className="flex flex-1">
      <aside
        className="w-1/2 bg-white p-6 transition-all duration-300 overflow-y-auto resize-x"
        style={{ resize: 'horizontal', maxWidth: '50%' }}
      >
        <h2 className="text-xl font-bold mb-4">Documents</h2>
        {isLoading && (
          <div className="text-center mt-4">
            <div className="animate-pulse">
              {loadingStatus === 'Thinking...' && (
                <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
              )}
              {loadingStatus === 'Searching...' && (
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              )}
            </div>
            <p className="mt-2">{loadingStatus}</p>
          </div>
        )}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {chatHistory.documents
            .filter((doc) => doc.abstract)
            .map((doc, index) => (
              <Card key={index} className="mb-4 p-4">
                <CardHeader>
                  <CardTitle>{doc.title}</CardTitle>
                  <CardDescription>
                    <p className="text-gray-600">
                      <strong>Authors:</strong> {doc.authors.join(", ")}
                    </p>
                    <p className="text-gray-600">
                      <strong>Year Published:</strong> {doc.yearPublished}
                    </p>
                    <p className="text-gray-600 mt-2">
                      <strong>Abstract:</strong> {doc.abstract}
                    </p>
                  </CardDescription>
                </CardHeader>
                <div className="mt-4">
                  <Button asChild className="px-4 py-2">
                    <a href={doc.downloadUrl} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
        </div>
        <p className="mt-4 italic">
          {chatHistory.documents.length - chatHistory.documents.filter((doc) => doc.abstract).length} documents without abstracts omitted from search results.
        </p>
      </aside>
      <section className="flex-1 p-6 bg-gray-100">
        <div className="bg-white p-6 overflow-y-auto max-h-[calc(100vh-250px)]">
          {chatHistory.messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.user === 'You' ? 'text-right' : 'text-left'}`}
              style={{ lineHeight: '1.4' }}
            >
              <strong>{message.user}:</strong> {message.assistant || message.text}
            </div>
          ))}
          {isLoading && (
            <div className="text-center mt-4">
              <div className="animate-pulse">
                {loadingStatus === 'Thinking...' && (
                  <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
                  )}
                  {loadingStatus === 'Searching...' && (
                    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  )}
                  {loadingStatus === 'Generating...' && (
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  )}
                </div>
                <p className="mt-2">{loadingStatus}</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-col space-y-2">
            <div className="flex">
              <Textarea
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 mr-2"
                placeholder="Type your message..."
              />
              <div className="flex flex-col space-y-2">
                <Button onClick={sendMessage} disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
                <Button onClick={regenerateResponse} disabled={isLoading} variant="outline">
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
