"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";

export default function page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if(result?.error){
      toast.success("Login Failed")
    }

    if(result?.url){
      router.replace('/dashboard')
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 border border-white/[0.08] rounded-xl">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 mb-2">
            Welcome back
          </h1>
          <p className="text-[14px] text-zinc-500">Sign in to your account</p>
        </div>
        <Form {...form}> 
          <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5">
            <FormField
            name="identifier"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel className="text-[13px] text-zinc-400">Email or Username</FormLabel>
                <FormControl>
                  <Input 
                  placeholder="Enter your email or username" {...field}
                  className="bg-zinc-800/50 border-white/[0.08] text-zinc-200 placeholder:text-zinc-600 text-[14px] h-10 focus-visible:ring-zinc-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            name="password"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel className="text-[13px] text-zinc-400">Password</FormLabel>
                <FormControl>
                  <Input 
                  type="password"
                  placeholder="Enter your password" {...field}
                  className="bg-zinc-800/50 border-white/[0.08] text-zinc-200 placeholder:text-zinc-600 text-[14px] h-10 focus-visible:ring-zinc-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium text-[14px] h-10">
            Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <p className="text-[13px] text-zinc-500">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-zinc-300 hover:text-zinc-50 underline underline-offset-4">
            Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
