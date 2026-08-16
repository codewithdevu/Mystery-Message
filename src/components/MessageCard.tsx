"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/user.model";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner"; 

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const handleDeleteConfirm = async () => {
      try {
        // Safe conversion to string to ensure dynamic segment route binding doesn't distort URL
        const msgId = String(message._id);
        
        // Target dynamic route: /api/delete-message/[messageid]
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${msgId}`);
        
        toast.success(response.data.message || "Message deleted successfully");
        onMessageDelete(msgId);
      } catch (error) {
        toast.error("Failed to delete message");
      }
    };

  return (
    <Card className="bg-zinc-900 border-white/[0.08] group">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5">
        <div className="flex flex-col gap-1.5 pr-4">
          <CardTitle className="text-[14px] font-medium text-zinc-200 leading-relaxed">
            {message.content}
          </CardTitle>
          <CardDescription className="text-[12px] text-zinc-600">
            {new Date(message.createdAt).toLocaleDateString()}
          </CardDescription> 
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-zinc-900 border-white/[0.08]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-zinc-100 text-[15px]">Delete this message?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-500 text-[13px]">
                This action cannot be undone. The message will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-zinc-800 border-white/[0.08] text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 text-[13px]">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 text-[13px]">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;