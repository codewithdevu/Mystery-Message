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
  
  // 💡 NEW STATE: Target user configuration status toggle check
  const [isAccepting, setIsAccepting] = useState<boolean | null>(null);

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
    "What's something you've always wanted to try but have been too afraid to do?",
    "If you could live in any fictional world, which one would it be and why?",
    "What's the best piece of advice you've ever received and how has it impacted your life?",
  ]);

  // 💡 FETCH INITIAL STATUS: User verification logic check on component mount
  useEffect(() => {
    const checkAcceptanceStatus = async () => {
      try {
        // Assume you have an endpoint like /api/check-accept-status?username=username 
        // or your current endpoint layout fetches target configuration schemas
        const response = await axios.get(`/api/accept-messages?username=${username}`);
        if (response.data) {
          setIsAccepting(response.data.isAcceptingMessages);
        }
      } catch (error) {
        console.error("Error fetching acceptance validation flags:", error);
        setIsAccepting(true); // Fallback configuration default parameters safety
      }
    };
    if (username) checkAcceptanceStatus();
  }, [username]);

  // Handler: Send Anonymous Message
  const HandleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // 💡 FRONTEND VALIDATION STEP: Dynamic checks trigger safely
    if (isAccepting === false) {
      toast.error("Please accept the message option first!");
      return;
    }

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
      
      // Backend handles fallback responses gracefully (403 errors etc.)
      toast.error(
        axiosError.response?.data?.message || "Please accept the message option first!"
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
    if (isAccepting === false) {
      toast.error("Please accept the message option first!");
      return;
    }
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
            className="w-full min-h-25 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder={isAccepting === false ? "This user is currently not accepting any messages." : "Write your anonymous message here..."}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            disabled={isAccepting === false}
            maxLength={300}
          />
        </div>
        <div className="flex justify-center">
          <Button 
            type="submit" 
            disabled={isLoading || !messageContent.trim() || isAccepting === false}
          >
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
            disabled={isSuggestLoading || isAccepting === false}
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
                className="w-full text-left justify-start h-auto whitespace-normal py-3 px-4 border text-sm disabled:opacity-50"
                onClick={() => handleMessageClick(message)}
                disabled={isAccepting === false}
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