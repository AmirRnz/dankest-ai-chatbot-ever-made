"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { X, Minimize2, Maximize2, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  // use this to create recommendations
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isFullScreen]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSwitchMode = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          chatHistory: messages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again later.",
          },
        ]);
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleToggleChat}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-32 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 group animate-subtle-pulse scale-chat-button"
        aria-label="Open chat with Maple Air AI"
      >
        <div className="mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>

        <span className="font-semibold text-sm p-1 w-20">
          Ask Any Questions!
        </span>
      </button>
    );
  }

  return (
    <>
      {isFullScreen ? (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={handleToggleChat}
        />
      ) : (
        <div className="fixed inset-0 z-50" onClick={handleToggleChat} />
      )}

      <div
        className={cn(
          "fixed z-50 flex flex-col bg-gray-50 shadow-xl transition-all duration-300",
          isFullScreen
            ? "inset-4 md:inset-10 lg:inset-20 rounded-xl"
            : "bottom-6 right-6 h-[500px] w-[380px] rounded-lg"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-500 bg-black px-4 py-3 text-white rounded-t-md">
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14 2C14 2.74028 13.5978 3.38663 13 3.73244V4H20C21.6569 4 23 5.34315 23 7V19C23 20.6569 21.6569 22 20 22H4C2.34315 22 1 20.6569 1 19V7C1 5.34315 2.34315 4 4 4H11V3.73244C10.4022 3.38663 10 2.74028 10 2C10 0.895431 10.8954 0 12 0C13.1046 0 14 0.895431 14 2ZM4 6H11H13H20C20.5523 6 21 6.44772 21 7V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V7C3 6.44772 3.44772 6 4 6ZM15 11.5C15 10.6716 15.6716 10 16.5 10C17.3284 10 18 10.6716 18 11.5C18 12.3284 17.3284 13 16.5 13C15.6716 13 15 12.3284 15 11.5ZM16.5 8C14.567 8 13 9.567 13 11.5C13 13.433 14.567 15 16.5 15C18.433 15 20 13.433 20 11.5C20 9.567 18.433 8 16.5 8ZM7.5 10C6.67157 10 6 10.6716 6 11.5C6 12.3284 6.67157 13 7.5 13C8.32843 13 9 12.3284 9 11.5C9 10.6716 8.32843 10 7.5 10ZM4 11.5C4 9.567 5.567 8 7.5 8C9.433 8 11 9.567 11 11.5C11 13.433 9.433 15 7.5 15C5.567 15 4 13.433 4 11.5ZM10.8944 16.5528C10.6474 16.0588 10.0468 15.8586 9.55279 16.1056C9.05881 16.3526 8.85858 16.9532 9.10557 17.4472C9.68052 18.5971 10.9822 19 12 19C13.0178 19 14.3195 18.5971 14.8944 17.4472C15.1414 16.9532 14.9412 16.3526 14.4472 16.1056C13.9532 15.8586 13.3526 16.0588 13.1056 16.5528C13.0139 16.7362 12.6488 17 12 17C11.3512 17 10.9861 16.7362 10.8944 16.5528Z"
                  fill="#ffffff "
                />
              </svg>
            </div>{" "}
            <h2 className="font-semibold">MapleAir AI Assistant</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwitchMode}
              className="h-8 w-8 text-white hover:bg-blue-200"
            >
              {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleChat}
              className="h-8 w-8 text-white hover:bg-blue-200"
            >
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <div className="flex flex-col h-24 w-24 items-center justify-center rounded-full bg-gray-300 relative">
              {/* First SVG - Smaller */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80px" // Smaller size
                height="80px" // Smaller size
                viewBox="0 0 24 24"
                fill="none"
                className="mb-[-110px] mt-2 " // Increased negative margin to pull the second SVG closer
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14 2C14 2.74028 13.5978 3.38663 13 3.73244V4H20C21.6569 4 23 5.34315 23 7V19C23 20.6569 21.6569 22 20 22H4C2.34315 22 1 20.6569 1 19V7C1 5.34315 2.34315 4 4 4H11V3.73244C10.4022 3.38663 10 2.74028 10 2C10 0.895431 10.8954 0 12 0C13.1046 0 14 0.895431 14 2ZM4 6H11H13H20C20.5523 6 21 6.44772 21 7V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V7C3 6.44772 3.44772 6 4 6ZM15 11.5C15 10.6716 15.6716 10 16.5 10C17.3284 10 18 10.6716 18 11.5C18 12.3284 17.3284 13 16.5 13C15.6716 13 15 12.3284 15 11.5ZM16.5 8C14.567 8 13 9.567 13 11.5C13 13.433 14.567 15 16.5 15C18.433 15 20 13.433 20 11.5C20 9.567 18.433 8 16.5 8ZM7.5 10C6.67157 10 6 10.6716 6 11.5C6 12.3284 6.67157 13 7.5 13C8.32843 13 9 12.3284 9 11.5C9 10.6716 8.32843 10 7.5 10ZM4 11.5C4 9.567 5.567 8 7.5 8C9.433 8 11 9.567 11 11.5C11 13.433 9.433 15 7.5 15C5.567 15 4 13.433 4 11.5ZM10.8944 16.5528C10.6474 16.0588 10.0468 15.8586 9.55279 16.1056C9.05881 16.3526 8.85858 16.9532 9.10557 17.4472C9.68052 18.5971 10.9822 19 12 19C13.0178 19 14.3195 18.5971 14.8944 17.4472C15.1414 16.9532 14.9412 16.3526 14.4472 16.1056C13.9532 15.8586 13.3526 16.0588 13.1056 16.5528C13.0139 16.7362 12.6488 17 12 17C11.3512 17 10.9861 16.7362 10.8944 16.5528Z"
                  fill="#000000"
                />
              </svg>

              {/* Second SVG - Larger */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="200px" // Larger size
                height="200px" // Larger size
                viewBox="0 0 300 300"
                className="mb-[-10px]"
              >
                <path
                  d="M90 235 Q150 265 210 235"
                  stroke="#0056a4"
                  stroke-width="10"
                  fill="none"
                  stroke-linecap="round"
                >
                  <animate
                    attributeName="d"
                    values="M90 235 Q150 265 210 235;M90 230 Q150 260 210 230;M90 235 Q150 265 210 235"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Welcome to MapleAir !</h3>
            <p className="text-gray-600">
              {` I'm your personal assistant. Ask me about our bundles, pricing, or
              any AC-related questions!`}
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 break-all">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "mb-4 max-w-[85%] rounded-lg p-3 ",
                message.role === "user"
                  ? "ml-auto bg-slate-900 text-white"
                  : "mr-auto bg-gray-300 text-gray-900"
              )}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="mr-auto mb-4 max-w-[85%] rounded-lg bg-gray-100 p-3 text-gray-800">
              <div className="flex space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our air conditioner bundles..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-black hover:bg-slate-900"
            >
              <Send size={18} />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
