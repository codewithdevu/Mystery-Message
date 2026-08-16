"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ||
              "Error checking username uniqueness",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUniqueness();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.success("Signup failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 border border-white/[0.08] rounded-xl">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 mb-2">
            Create an account
          </h1>
          <p className="text-[14px] text-zinc-500">Start your anonymous journey</p>
        </div>
        <Form {...form}> 
          <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5">
            <FormField
            name="username"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel className="text-[13px] text-zinc-400">Username</FormLabel>
                <FormControl>
                  <Input 
                  placeholder="Choose a username" {...field}
                  className="bg-zinc-800/50 border-white/[0.08] text-zinc-200 placeholder:text-zinc-600 text-[14px] h-10 focus-visible:ring-zinc-600"
                  onChange={(e) => {
                    field.onChange(e)
                    debounced(e.target.value)
                  }}
                  />
                </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4 text-zinc-500" />}
                  {usernameMessage && (
                    <p className={`text-[12px] ${usernameMessage === "Username is unique" ? 'text-emerald-500' : 'text-red-400'}`}>
                      {usernameMessage}
                    </p>
                  )}
                <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            name="email"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel className="text-[13px] text-zinc-400">Email</FormLabel>
                <FormControl>
                  <Input 
                  placeholder="Enter your email" {...field}
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
                  placeholder="Create a password" {...field}
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
              {
                isSubmitting ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                  </>
                ) : ('Sign Up')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <p className="text-[13px] text-zinc-500">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-zinc-300 hover:text-zinc-50 underline underline-offset-4">
            Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
