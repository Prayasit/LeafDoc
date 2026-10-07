
"use client";

import type { FormEvent } from "react";
import { useState, useRef, useEffect } from "react";
import { plantChat, PlantChatInput } from "@/ai/flows/plant-chat-flow";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, User, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export function PlantChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: "initial-bot-message",
        sender: "bot",
        text: "Hello! I'm PlantBot. Ask me anything about plants!",
        timestamp: new Date(),
      },
    ]);
    inputRef.current?.focus();
  }, []);


  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const question = inputValue.trim();
    if (!question) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: question,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const chatInput: PlantChatInput = { question };
      const result = await plantChat(chatInput);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: result.answer,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error calling plantChat flow:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Chatbot Error",
        description: `Failed to get a response: ${errorMessage}`,
      });
      const errorBotMessage: Message = {
        id: `bot-error-${Date.now()}`,
        sender: "bot",
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <Card className="w-full h-full flex flex-col bg-card shadow-md rounded-xl border border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold"><Bot className="text-primary"/> PlantBot Assistant</CardTitle>
        <CardDescription>Your AI-powered guide for all things plants.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-grow p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2.5 py-2", 
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.sender === "bot" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm shadow-sm", 
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none" 
                      : "bg-muted text-muted-foreground rounded-bl-none border border-border" 
                  )}
                >
                  <p style={{ whiteSpace: 'pre-wrap' }} className="leading-relaxed">{msg.text}</p>
                  <p className={cn(
                      "text-xs mt-1 opacity-70",
                      msg.sender === "user" ? "text-right" : "text-left"
                    )}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.sender === "user" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0 border border-border">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-start gap-2.5 py-2">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                <div className="bg-muted text-muted-foreground rounded-lg px-3.5 py-2.5 text-sm shadow-sm border border-border">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
        </ScrollArea>
        <div className="p-3 border-t border-border bg-card/50">
          <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask PlantBot..."
              className="flex-grow bg-background border-border focus:ring-primary/50 text-sm placeholder:text-muted-foreground"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <Button type="submit" disabled={isLoading || !inputValue.trim()} size="icon" className="bg-primary hover:bg-primary/90 rounded-lg w-9 h-9">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
