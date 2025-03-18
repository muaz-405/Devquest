import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

// Schema for post creation
const postSchema = z.object({
  content: z.string().min(1, { message: "Content cannot be empty" }),
});

type PostFormValues = z.infer<typeof postSchema>;

interface CreatePostFormProps {
  threadId: number;
  parentId?: number;
  onSuccess?: () => void;
}

export default function CreatePostForm({ threadId, parentId, onSuccess }: CreatePostFormProps) {
  const { toast } = useToast();

  // Initialize form
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      const res = await apiRequest("POST", `/api/threads/${threadId}/posts`, {
        ...data,
        parentId,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/threads/${threadId}/posts`] });
      form.reset();
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to post reply",
        description: error.message || "Something went wrong, please try again",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(data: PostFormValues) {
    createPostMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Reply</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your thoughts or code. Use ```language before and ``` after code blocks for syntax highlighting."
                  className="min-h-[150px]"
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
        
        <Button type="submit" disabled={createPostMutation.isPending}>
          {createPostMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Reply"
          )}
        </Button>
      </form>
    </Form>
  );
}
