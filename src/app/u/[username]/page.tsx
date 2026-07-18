"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { fa } from "zod/v4/locales";

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  // state management
  const [messageContent, setMessageContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
    "What's something you've always wanted to try but have been too afraid to do?",
    "If you could live in any fictional world, which one would it be and why?",
    "What's the best piece of advice you've ever received and how has it impacted your life?",
  ]);

  // Handler: Send Anonymous Message
  const HandleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) {
      toast.error("Message cannot be Empty");
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
        axiosError.response?.data?.message || "Failed to send message",
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
      toast.error("Failed to fetch AI suggestions");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  // Helper: Click suggestion to populate input box
  const handleMessageClick = (message: string) => {
    setMessageContent(message);
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Public Profile Link</h1>

      {/* Message Input Section */}
      <form onSubmit={HandleSendMessage} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Send Anonymous Message to @{username}</label>
          <textarea
            className="w-full min-h-25 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Write your anonymous message here..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            maxLength={300}
          />
        </div>
        <div className="flex justify-center">
          <Button type="submit" disabled={isLoading || !messageContent.trim()}>
            {isLoading ? 'Sending...' : 'Send It'}
          </Button>
        </div>
      </form>

      <div className="my-8">
        <Separator />
      </div>

      {/* AI Suggestions Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Button
            onClick={handleSuggestMessages}
            disabled={isSuggestLoading}
            variant="outline"
          >
            {isSuggestLoading ? 'Suggesting...' : 'Suggest Messages'}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">Click on any message below to select it.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {suggestedMessages.map((message, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto whitespace-normal py-3 px-4 border text-sm"
                onClick={() => handleMessageClick(message)}
              >
                {message}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
