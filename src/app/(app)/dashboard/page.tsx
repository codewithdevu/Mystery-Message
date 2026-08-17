"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Loader2,
  RefreshCcw,
  Copy,
  Check,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/model/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      const statusValue =
        response.data.isAcceptingMessage ??
        (response.data as any).isAcceptingMessages;
      setValue("acceptMessages", !!statusValue);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.message ||
          "Failed to fetch message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessage = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success("Messages refreshed");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data?.message || "Failed to fetch messages"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessage();
    fetchAcceptMessage();
  }, [session, fetchAcceptMessage, fetchMessage]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const nextState = !acceptMessages;
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptedMessages: nextState,
      });

      setValue("acceptMessages", nextState);
      toast.success(response.data.message || "Settings updated");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.message ||
          "Failed to update message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const { username } = session?.user || ({} as User);

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";

  const profileUrl = baseUrl && username ? `${baseUrl}/u/${username}` : "";

  const copyToClipboard = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-white/8rounded-xl max-w-sm w-full text-center">
          <h2 className="text-lg font-medium text-zinc-100 mb-2">Sign in required</h2>
          <p className="text-[13px] text-zinc-500">
            Please log in to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-50">
              Dashboard
            </h1>
            <p className="text-[13px] text-zinc-500 mt-1">
              Welcome back, {username}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              fetchMessage(true);
            }}
            disabled={isLoading}
            className="text-[13px] text-zinc-400 hover:text-zinc-200 hover:bg-white/6 self-start md:self-auto h-8"
          >
            <RefreshCcw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          
          {/* Profile Link Card */}
          <div className="lg:col-span-3 bg-zinc-900 border border-white/8 p-5 rounded-xl">
            <div className="mb-4">
              <h2 className="text-[13px] font-medium text-zinc-400 mb-1">
                Your profile link
              </h2>
              <p className="text-[12px] text-zinc-600">
                Share this link to receive anonymous messages.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="flex-1 bg-zinc-800/50 border border-white/8 rounded-lg px-3.5 py-2 text-[13px] font-mono text-zinc-400 focus:outline-none select-all"
              />
              <Button
                onClick={copyToClipboard}
                size="sm"
                className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium text-[13px] h-9 px-4 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Accept Messages Toggle */}
          <div className="lg:col-span-2 bg-zinc-900 border border-white/8 p-5 rounded-xl flex flex-col justify-between">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[13px] font-medium text-zinc-400">
                  Accepting messages
                </h2>
                <span
                  className={`text-[11px] font-medium ${
                    acceptMessages
                      ? "text-emerald-500"
                      : "text-zinc-600"
                  }`}
                >
                  {acceptMessages ? "Active" : "Paused"}
                </span>
              </div>
              <p className="text-[12px] text-zinc-600">
                Control whether new messages can be sent to you.
              </p>
            </div>

            <div className="flex items-center justify-between bg-zinc-800/40 border border-white/5 p-3 rounded-lg">
              <span className="text-[13px] text-zinc-400">
                Accept messages
              </span>
              <div className="flex items-center gap-2">
                {isSwitchLoading && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                )}
                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/6" />

        {/* Messages Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-medium text-zinc-200">
              Messages
            </h2>
            <span className="text-[12px] font-mono text-zinc-600 bg-zinc-800/60 px-2 py-0.5 rounded">
              {messages.length}
            </span>
          </div>

          {messages && messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900 border border-white/8 rounded-xl p-10 text-center">
              <h3 className="text-[14px] font-medium text-zinc-400 mb-1">
                No messages yet
              </h3>
              <p className="text-[13px] text-zinc-600 max-w-sm mx-auto mb-5">
                Share your profile link to start receiving anonymous messages.
              </p>
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="sm"
                className="text-[13px] text-zinc-400 hover:text-zinc-200 hover:bg-white/6"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy link
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;