import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet";
import { apiRequest, queryClient } from "@/lib/queryClient";
import CreatePostForm from "@/components/CreatePostForm";
import CodeBlock from "@/components/CodeBlock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, MessageSquare, Flag, ThumbsUp, ThumbsDown, ArrowLeft, Bell, BellOff } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Form schema for flagging content
const flagSchema = z.object({
  reason: z.string().min(10, { message: "Please provide a reason with at least 10 characters" })
});

export default function ThreadPage() {
  const params = useParams<{ id: string }>();
  const threadId = parseInt(params.id);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // Flag form
  const flagForm = useForm<z.infer<typeof flagSchema>>({
    resolver: zodResolver(flagSchema),
    defaultValues: {
      reason: ""
    }
  });

  const { 
    data: thread,
    isLoading: isLoadingThread,
    error: threadError
  } = useQuery({
    queryKey: [`/api/threads/${threadId}`],
    enabled: !!threadId && !isNaN(threadId)
  });

  const { 
    data: posts,
    isLoading: isLoadingPosts,
    error: postsError
  } = useQuery({
    queryKey: [`/api/threads/${threadId}/posts`],
    enabled: !!threadId && !isNaN(threadId)
  });

  const { data: subscription } = useQuery({
    queryKey: [`/api/subscriptions/thread/${threadId}`],
    enabled: !!user && !!threadId && !isNaN(threadId)
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ postId, value }: { postId: number, value: number }) => {
      const res = await apiRequest("POST", `/api/posts/${postId}/vote`, { value });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/threads/${threadId}/posts`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Vote failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Flag mutation
  const flagMutation = useMutation({
    mutationFn: async ({ postId, reason }: { postId: number, reason: string }) => {
      const res = await apiRequest("POST", `/api/posts/${postId}/flag`, { reason });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Content flagged",
        description: "Thank you for helping to keep our community safe."
      });
      setIsFlagDialogOpen(false);
      flagForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to flag content",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/subscriptions`, { 
        threadId, 
        notifyByEmail: true, 
        notifyInPlatform: true 
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/subscriptions/thread/${threadId}`] });
      toast({
        title: "Subscribed",
        description: "You'll receive notifications for new posts in this thread."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Unsubscribe mutation
  const unsubscribeMutation = useMutation({
    mutationFn: async (subscriptionId: number) => {
      await apiRequest("DELETE", `/api/subscriptions/${subscriptionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/subscriptions/thread/${threadId}`] });
      toast({
        title: "Unsubscribed",
        description: "You won't receive notifications for this thread anymore."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Unsubscribe failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Handle vote
  const handleVote = (postId: number, value: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on posts.",
        variant: "destructive"
      });
      return;
    }
    
    voteMutation.mutate({ postId, value });
  };

  // Handle flag submission
  const handleFlagSubmit = (data: z.infer<typeof flagSchema>) => {
    if (!user || !selectedPostId) return;
    
    flagMutation.mutate({ 
      postId: selectedPostId, 
      reason: data.reason 
    });
  };

  // Open flag dialog
  const openFlagDialog = (postId: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to flag content.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedPostId(postId);
    setIsFlagDialogOpen(true);
  };

  if (isNaN(threadId)) {
    navigate("/");
    return null;
  }

  if (isLoadingThread || isLoadingPosts) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
      </div>
    );
  }

  if (threadError || !thread) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Thread not found</h2>
          <p className="mt-2 text-gray-600">The thread you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Return to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{thread.title} | CodeNexus</title>
      </Helmet>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(thread.category ? `/categories/${thread.category.id}` : "/")}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to {thread.category ? thread.category.name : "home"}</span>
            </Button>
            
            {user && (
              subscription ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => unsubscribeMutation.mutate(subscription.id)}
                  className="flex items-center gap-1"
                  disabled={unsubscribeMutation.isPending}
                >
                  {unsubscribeMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                  <span>Unsubscribe</span>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => subscribeMutation.mutate()}
                  className="flex items-center gap-1"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                  <span>Subscribe</span>
                </Button>
              )
            )}
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-2xl">{thread.title}</CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    Posted by {thread.user?.name || "Anonymous"} · 
                    {thread.createdAt && (
                      <span>{format(new Date(thread.createdAt), "MMM d, yyyy")}</span>
                    )}
                    {thread.category && (
                      <Badge 
                        style={{ backgroundColor: thread.category.color }}
                      >
                        {thread.category.name}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center text-gray-600">
                  <MessageSquare className="mr-1 h-5 w-5" />
                  <span>{posts?.length || 0} replies</span>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          {postsError ? (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-red-500">Error loading posts. Please try again.</p>
              </CardContent>
            </Card>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} id={`post-${post.id}`} className="relative">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar>
                      <AvatarImage src={post.user?.avatar} alt={post.user?.name} />
                      <AvatarFallback>
                        {post.user?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{post.user?.name || "Anonymous"}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        {post.createdAt && (
                          <span>{format(new Date(post.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                        )}
                        {post.user?.reputation !== undefined && (
                          <Badge variant="outline" className="ml-2">
                            Rep: {post.user.reputation}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose max-w-none" 
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleVote(post.id, 1)}
                        className={post.userVote === 1 ? "text-green-600" : ""}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{post.score > 0 ? post.score : ""}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleVote(post.id, -1)}
                        className={post.userVote === -1 ? "text-red-600" : ""}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openFlagDialog(post.id)}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      <span>Flag</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p>No posts in this thread yet.</p>
              </CardContent>
            </Card>
          )}
          
          {!thread.isClosed ? (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Reply to this thread</CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <CreatePostForm threadId={threadId} />
                ) : (
                  <div className="text-center py-4">
                    <p className="mb-4">You need to be logged in to reply</p>
                    <Button onClick={() => navigate("/auth")}>
                      Log in or Register
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="mt-6 bg-amber-50">
              <CardContent className="pt-6">
                <p className="text-amber-800 font-medium">This thread is closed for new replies.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Flag Dialog */}
      <Dialog open={isFlagDialogOpen} onOpenChange={setIsFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag inappropriate content</DialogTitle>
            <DialogDescription>
              Please provide a reason for flagging this content. Our moderators will review it.
            </DialogDescription>
          </DialogHeader>
          <Form {...flagForm}>
            <form onSubmit={flagForm.handleSubmit(handleFlagSubmit)}>
              <FormField
                control={flagForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Please explain why you're flagging this content"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsFlagDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={flagMutation.isPending}>
                  {flagMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Flag"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
