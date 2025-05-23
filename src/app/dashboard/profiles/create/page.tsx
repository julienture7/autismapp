"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  age: z.coerce
    .number()
    .int()
    .min(3, { message: "Age must be at least 3 years" })
    .max(12, { message: "Age must be 12 years or less" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function CreateProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      age: 5,
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    if (status !== "authenticated") {
      toast.error("You must be logged in to create a profile");
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/profiles/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create profile");
      }

      toast.success("Child profile created successfully!");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-180px)] flex justify-center items-center">
          <p className="text-lg">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center px-6 py-16 md:px-20 lg:px-40 gradient-bg min-h-[calc(100vh-180px)]">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center secondary-text">Create Child Profile</CardTitle>
            <CardDescription className="text-center">
              Set up a profile for your child to personalize their WonderChat experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This name will be used by WonderChat to personalize interactions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child's Age</FormLabel>
                      <FormControl>
                        <Input type="number" min={3} max={12} {...field} />
                      </FormControl>
                      <FormDescription>
                        WonderChat adapts its content based on your child's age (3-12 years)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full primary-bg text-white hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating profile..." : "Create Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-slate-600">
              After creating a profile, you'll be able to start chat sessions and track progress
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
