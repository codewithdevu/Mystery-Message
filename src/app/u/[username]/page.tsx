"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  // state management
  const [messageContent, setMessageContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  
  const [isAccepting, setIsAccepting] = useState<boolean | null>(null);

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
    "What's something you've always wanted to try but have been too afraid to do?",
    "If you could live in any fictional world, which one would it be and why?",
    "What's the best piece of advice you've ever received and how has it impacted your life?",
  ]);

  useEffect(() => {
    const checkAcceptanceStatus = async () => {
      try {
        const response = await axios.get(`/api/accept-messages?username=${username}`);
        if (response.data) {
          setIsAccepting(response.data.isAcceptingMessages);
        }
      } catch (error) {
        console.error("Error fetching acceptance validation flags:", error);
        setIsAccepting(true);
      }
    };
    if (username) checkAcceptanceStatus();
  }, [username]);

  // Handler: Send Anonymous Message
  const HandleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isAccepting === false) {
      toast.error("This user is not accepting messages right now.");
      return;
    }

    if (!messageContent.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: messageContent,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Message sent successfully");
        setMessageContent("");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      
      toast.error(
        axiosError.response?.data?.message || "This user is not accepting messages right now."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Get AI Suggested Questions
  const handleSuggestMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post("/api/suggest-messages");
      const rawText = response.data.text;

      if (rawText) {
        const questionsArray = rawText.split("||").map((q: string) => q.trim());
        setSuggestedMessages(questionsArray);
        toast.success("New suggestions loaded!");
      }
    } catch (error) {
      toast.error("Failed to fetch suggestions");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  // Helper: Click suggestion to populate input box
  const handleMessageClick = (message: string) => {
    if (isAccepting === false) {
      toast.error("This user is not accepting messages right now.");
      return;
    }
    setMessageContent(message);
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            Send a message to @{username}
          </h1>
          <p className="text-[14px] text-zinc-500">
            Your identity will remain completely anonymous.
          </p>
        </div>

        {/* Message Input Section */}
        <form onSubmit={HandleSendMessage} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-zinc-400">Your message</label>
            <textarea
              className="w-full min-h-[120px] p-4 bg-zinc-900 border border-white/[0.08] rounded-lg text-[14px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              placeholder={isAccepting === false ? "This user is currently not accepting messages." : "Write your anonymous message here..."}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              disabled={isAccepting === false}
              maxLength={300}
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-600">{messageContent.length}/300</span>
            </div>
          </div>
          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={isLoading || !messageContent.trim() || isAccepting === false}
              className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium text-[14px] h-10 px-8"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>

        <Separator className="bg-white/[0.06]" />

        {/* Suggestions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-medium text-zinc-300">Suggested messages</h2>
            <Button
              onClick={handleSuggestMessages}
              disabled={isSuggestLoading || isAccepting === false}
              variant="ghost"
              size="sm"
              className="text-[13px] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]"
            >
              {isSuggestLoading ? 'Loading...' : 'Refresh suggestions'}
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {suggestedMessages.map((message, index) => (
              <button
                key={index}
                className="w-full text-left p-3.5 bg-zinc-900 border border-white/[0.08] rounded-lg text-[13px] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.15] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => handleMessageClick(message)}
                disabled={isAccepting === false}
              >
                {message}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}