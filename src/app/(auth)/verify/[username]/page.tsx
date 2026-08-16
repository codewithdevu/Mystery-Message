"use client";

import { verifySchema } from "@/schemas/verifySchema";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success("Account verified successfully!");
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verification:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message || "Signup failed. Please try again.";
      
      toast.error(errorMessage); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 border border-white/[0.08] rounded-xl">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 mb-2">
            Verify your account
          </h1>
          <p className="text-[14px] text-zinc-500">Enter the verification code sent to your email</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] text-zinc-400">Verification Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter code" 
                      {...field}
                      className="bg-zinc-800/50 border-white/[0.08] text-zinc-200 placeholder:text-zinc-600 text-[14px] h-10 focus-visible:ring-zinc-600 tracking-widest text-center"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              className="w-full bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium text-[14px] h-10"
            >
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}