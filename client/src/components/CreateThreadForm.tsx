import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

// Schema for thread creation
const threadSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100, { message: "Title must be less than 100 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
});

type ThreadFormValues = z.infer<typeof threadSchema>;

interface CreateThreadFormProps {
  categoryId: number;
  onSuccess?: () => void;
}

export default function CreateThreadForm({ categoryId, onSuccess }: CreateThreadFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Initialize form
  const form = useForm<ThreadFormValues>({
    resolver: zodResolver(threadSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Create thread mutation
  const createThreadMutation = useMutation({
    mutationFn: async (data: ThreadFormValues) => {
      const res = await apiRequest("POST", "/api/threads", {
        ...data,
        categoryId,
      });
      return await res.json();
    },
    onSuccess: (thread) => {
      queryClient.invalidateQueries({ queryKey: [`/api/categories/${categoryId}/threads`] });
      toast({
        title: "Thread created",
        description: "Your thread has been created successfully",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Navigate to the new thread
      navigate(`/threads/${thread.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create thread",
        description: error.message || "Something went wrong, please try again",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(data: ThreadFormValues) {
    createThreadMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thread Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a descriptive title" {...field} />
              </FormControl>
              <FormDescription>
                Make your title specific and engaging
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter your thread content. Use ```language before and ``` after code blocks for syntax highlighting."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                For code blocks, use: ```javascript [your code] ```
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={createThreadMutation.isPending}>
          {createThreadMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating thread...
            </>
          ) : (
            "Create Thread"
          )}
        </Button>
      </form>
    </Form>
  );
}
