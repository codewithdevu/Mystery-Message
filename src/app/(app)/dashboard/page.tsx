"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useForm } from "react-hook-form";

const motion = {
  div: ({ initial, animate, transition, ...rest }: any) => <div {...rest} />,
};

const AnimatePresence = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Loader2,
  RefreshCcw,
  Copy,
  Check,
  ShieldCheck,
  Inbox,
  Sparkles,
  Link as LinkIcon,
  Radio,
  Lock,
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
          toast.success("Messages synchronized");
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
    toast.success("Unique URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Unauthenticated Sleek State ---
  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4 relative overflow-hidden selection:bg-purple-500 selection:text-white">
        <div className="absolute w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl"
        >
          <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-400 mb-6">
            Please log in to your account to view your dashboard and secret messages.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 py-10 px-4 md:px-8 relative overflow-hidden selection:bg-purple-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-150 h-75 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-100 h-75 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 tracking-wider uppercase">
                INCOGNITO CONTROLS
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-indigo-300 to-amber-300">
                {username}
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Manage your personal mystery link and view real-time incoming messages.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessage(true);
            }}
            disabled={isLoading}
            className="bg-[#0B0F17]/80 border-white/10 hover:bg-white/5 text-slate-200 hover:text-white transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <RefreshCcw className={`h-4 w-4 text-purple-400 ${isLoading ? "animate-spin" : ""}`} />
            <span className="text-xs font-medium">
              {isLoading ? "Syncing..." : "Refresh Signals"}
            </span>
          </Button>
        </motion.div>

        {/* Dashboard Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Unique Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-[#111827]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                  Your Mystery Signal Link
                </h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Share this unique link on Instagram, Snapchat, or WhatsApp to receive anonymous feedback.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="w-full bg-[#0B0F17]/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs md:text-sm font-mono text-purple-300 focus:outline-none focus:border-purple-500/50 transition-all select-all pr-10"
                />
              </div>
              <Button
                onClick={copyToClipboard}
                className="w-full sm:w-auto bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-600/20"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Accepting Messages Toggle Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111827]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                    Inbox Status
                  </h2>
                </div>
                {/* Status Glow Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                    acceptMessages
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      acceptMessages
                        ? "bg-emerald-400 animate-pulse"
                        : "bg-rose-400"
                    }`}
                  />
                  {acceptMessages ? "Active" : "Paused"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Toggle whether people can send new messages to your inbox.
              </p>
            </div>

            <div className="flex items-center justify-between bg-[#0B0F17]/60 border border-white/5 p-3 rounded-xl">
              <span className="text-xs font-medium text-slate-300">
                Accept Messages
              </span>
              <div className="flex items-center gap-2">
                {isSwitchLoading && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                )}
                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <Separator className="bg-white/10 my-6" />

        {/* Messages Grid Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">
              Incoming Secret Signals
            </h2>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-mono bg-purple-500/10 border border-purple-500/20 text-purple-300">
              {messages.length}
            </span>
          </div>
        </div>

        {/* Messages Grid / Empty State */}
        <AnimatePresence>
          {messages && messages.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#111827]/40 backdrop-blur-md border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-62.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-200 mb-1">
                No Signals Received Yet
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6">
                Your inbox is currently empty. Share your link on social media to start receiving anonymous messages!
              </p>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="bg-[#0B0F17] border-white/10 hover:bg-white/5 text-purple-300 text-xs gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Link to Share
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DashboardPage;