"use client";
import React, { useRef, useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Bot,
  Search,
  Brain,
  Image as ImageIcon,
  Paperclip,
  ArrowUpCircle,
  SlidersHorizontal,
  User,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { sendMessageToAI, isAIConfigured } from "@/lib/aiService";
import { useToast } from "@/hooks/use-toast";

const features = [
  {
    icon: <Search className="w-5 h-5 mr-2" />,
    title: "DeepSearch",
    description:
      "Search deeply to deliver detailed, well-reasoned answers with MediaGrid's rapid, agentic search.",
  },
  {
    icon: <Brain className="w-5 h-5 mr-2" />,
    title: "Think",
    description:
      "Solve the hardest problems in math, science, and coding with our reasoning model.",
  },
  {
    icon: <ImageIcon className="w-5 h-5 mr-2" />,
    title: "Edit Image",
    description: "Transform your images with style transfers, edits, and more.",
  },
];

// Define message types
type MessageType = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  isLoading?: boolean;
  error?: boolean;
};

// Define conversation history type for API calls
type ConversationHistory = Array<{ role: string; content: string }>;

const ChatAIPage = () => {
  const { currentUser } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] =
    useState<ConversationHistory>([]);
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if API is configured and add initial greeting message when component mounts
  useEffect(() => {
    const configured = isAIConfigured();
    setApiConfigured(configured);

    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: configured
            ? "Hello! I'm MediaGrid AI powered by Hugging Face. How can I assist you today?"
            : "Hello! I'm MediaGrid AI. Please note that I'm running in demo mode because the Hugging Face token is not configured. Responses will be limited.",
          sender: "ai",
          timestamp: new Date(),
          error: !configured,
        },
      ]);

      if (!configured) {
        toast({
          title: "Hugging Face Token Not Configured",
          description:
            "MediaGrid AI is running in demo mode. Set NEXT_PUBLIC_HF_TOKEN in your environment to enable full functionality.",
          variant: "destructive",
        });
      }
    }
  }, [messages.length, toast]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: userInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Show typing indicator
    setIsTyping(true);

    // Update conversation history for context
    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: userInput },
    ];
    setConversationHistory(updatedHistory);

    try {
      if (apiConfigured) {
        // Call the real AI service
        const response = await sendMessageToAI(userInput, updatedHistory);

        setIsTyping(false);

        const aiMessage: MessageType = {
          id: response.id || Date.now().toString(),
          content: response.text,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Update conversation history with AI response
        setConversationHistory([
          ...updatedHistory,
          { role: "assistant", content: response.text },
        ]);
      } else {
        // Fallback to demo mode with delayed response
        setTimeout(() => {
          setIsTyping(false);

          const demoResponses = [
            "I'm in demo mode because the Hugging Face token isn't configured. I can still chat, but with limited capabilities.",
            "This is a demo response. To enable full AI capabilities with DeepSeek-R1 model, please configure the Hugging Face token in your environment variables.",
            "I'm MediaGrid AI in demo mode. My responses are pre-defined since I'm not connected to the Hugging Face API.",
            "In demo mode, I can only provide basic responses. Set up the Hugging Face token to unlock my full potential with the DeepSeek-R1 model!",
            "This is a simulated response. For the full AI experience with Hugging Face's models, please configure your API credentials.",
          ];

          const randomIndex = Math.floor(Math.random() * demoResponses.length);

          const aiMessage: MessageType = {
            id: Date.now().toString(),
            content: demoResponses[randomIndex],
            sender: "ai",
            timestamp: new Date(),
            error: true,
          };

          setMessages((prev) => [...prev, aiMessage]);
        }, 1000 + Math.random() * 1000);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);

      setIsTyping(false);

      const errorMessage: MessageType = {
        id: Date.now().toString(),
        content:
          "I'm sorry, I encountered an error processing your request. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
        error: true,
      };

      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to get a response from the AI service.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="w-full py-8 px-0 md:px-0">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mt-8 mb-6">
          <span className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-500 to-indigo-700 text-transparent bg-clip-text">
            MediaGrid AI
          </span>
        </div>

        {/* Chat Container */}
        <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-16rem)]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 bg-[var(--color-bg-secondary)] rounded-t-xl p-4 border border-[var(--color-border)]">
            <div className="space-y-4 pb-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 max-w-[85%]",
                    message.sender === "user" ? "ml-auto" : ""
                  )}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 border border-[var(--color-border)]">
                      <AvatarImage src="/bot-avatar.png" alt="AI" />
                      <AvatarFallback className="bg-indigo-600 text-white">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm",
                      message.sender === "user"
                        ? "bg-[var(--color-primary)] text-white"
                        : message.error
                        ? "bg-[var(--color-bg)] border border-red-300 text-[var(--color-text-secondary)]"
                        : "bg-[var(--color-bg)] border border-[var(--color-border)]"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 border border-[var(--color-border)]">
                      <AvatarImage
                        src={currentUser?.photoURL || undefined}
                        alt={currentUser?.displayName || "User"}
                      />
                      <AvatarFallback className="bg-[var(--color-primary)] text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-3 max-w-[85%]">
                  <Avatar className="h-8 w-8 border border-[var(--color-border)]">
                    <AvatarFallback className="bg-indigo-600 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-xl px-4 py-3 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>AI is typing</span>
                  </div>
                </div>
              )}

              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input Section */}
          <div className="w-full">
            <form
              onSubmit={handleSend}
              className="bg-[var(--color-bg-secondary)] rounded-b-xl shadow flex flex-col gap-4 p-4 border border-t-0 border-[var(--color-border)]"
            >
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-[var(--color-text-secondary)] cursor-pointer" />
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 bg-transparent outline-none text-lg placeholder:text-[var(--color-text-secondary)] text-[var(--color-text)]"
                  placeholder="Ask anything"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-[var(--color-bg)]"
                  tabIndex={-1}
                >
                  <SlidersHorizontal className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </button>
                <button
                  type="submit"
                  className="ml-2 p-2 rounded-full bg-[var(--color-primary)] hover:bg-opacity-90 transition"
                  disabled={!input.trim()}
                >
                  <ArrowUpCircle className="w-6 h-6 text-[var(--color-bg-secondary)]" />
                </button>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  type="button"
                  className="bg-[var(--color-bg)] text-[var(--color-text)] px-4 py-1 rounded-full text-sm flex items-center gap-2 border border-[var(--color-border)]"
                  onClick={() => {
                    setInput("Use DeepSearch to find information about: ");
                    inputRef.current?.focus();
                  }}
                >
                  <Search className="w-4 h-4" /> DeepSearch
                </button>
                <button
                  type="button"
                  className="bg-[var(--color-bg)] text-[var(--color-text)] px-4 py-1 rounded-full text-sm flex items-center gap-2 border border-[var(--color-border)]"
                  onClick={() => {
                    setInput("Think about this problem: ");
                    inputRef.current?.focus();
                  }}
                >
                  <Brain className="w-4 h-4" /> Think
                </button>
                <button
                  type="button"
                  className="bg-[var(--color-bg)] text-[var(--color-text)] px-4 py-1 rounded-full text-sm flex items-center gap-2 border border-[var(--color-border)]"
                  onClick={() => {
                    setInput("Edit this image to: ");
                    inputRef.current?.focus();
                  }}
                >
                  <ImageIcon className="w-4 h-4" /> Edit Image
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-3xl mx-auto mt-6">
          <div className="mb-2">
            <span className="font-bold text-lg text-[var(--color-primary)]">
              MediaGrid AI is here.
            </span>
            <span className="ml-2 text-[var(--color-text-secondary)]">
              Try our new features: DeepSearch, Think, and Edit Image
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex-1 bg-[var(--color-bg-secondary)] rounded-xl p-5 flex flex-col border border-[var(--color-border)]"
              >
                <div className="flex items-center mb-2">
                  {feature.icon}
                  <span className="font-semibold text-[var(--color-primary)]">
                    {feature.title}
                  </span>
                </div>
                <div className="text-[var(--color-text-secondary)] text-sm">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatAIPage;
