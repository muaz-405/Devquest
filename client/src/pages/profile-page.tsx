import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import ThreadList from "@/components/ThreadList";
import { Helmet } from "react-helmet";

// Profile form schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  programmingLanguages: z.string().optional(),
  expertise: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Get user profile data
  const { 
    data: profileData,
    isLoading: isLoadingProfile
  } = useQuery({
    queryKey: [`/api/users/${user?.id}/profile`],
    enabled: !!user
  });

  // Get user's threads
  const { 
    data: userThreads,
    isLoading: isLoadingThreads
  } = useQuery({
    queryKey: [`/api/users/${user?.id}/threads`],
    enabled: !!user && activeTab === "threads"
  });

  // Get user's subscriptions
  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions
  } = useQuery({
    queryKey: ["/api/subscriptions"],
    enabled: !!user && activeTab === "subscriptions"
  });

  // Form initialization
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
      websiteUrl: "",
      portfolioUrl: "",
      programmingLanguages: "",
      expertise: "",
    },
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || "",
        bio: profileData.bio || "",
        websiteUrl: profileData.websiteUrl || "",
        portfolioUrl: profileData.portfolioUrl || "",
        programmingLanguages: profileData.programmingLanguages ? profileData.programmingLanguages.join(", ") : "",
        expertise: profileData.expertise ? profileData.expertise.join(", ") : "",
      });
    }
  }, [profileData, form]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      // Convert comma-separated strings to arrays
      const processedData = {
        ...data,
        programmingLanguages: data.programmingLanguages ? 
          data.programmingLanguages.split(",").map(lang => lang.trim()).filter(Boolean) : 
          [],
        expertise: data.expertise ? 
          data.expertise.split(",").map(exp => exp.trim()).filter(Boolean) : 
          [],
      };

      const res = await apiRequest("PUT", "/api/profile", processedData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/profile`] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(data: ProfileFormValues) {
    updateProfileMutation.mutate(data);
  }

  if (!user) {
    return null; // ProtectedRoute component should handle redirection
  }

  if (isLoadingProfile && activeTab === "profile") {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile | CodeNexus</title>
      </Helmet>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center mb-4 sm:mb-0">
              <Avatar className="h-16 w-16 md:h-20 md:w-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">{user.email}</p>
                {profileData?.reputation !== undefined && (
                  <p className="text-sm text-primary-600">Reputation: {profileData.reputation}</p>
                )}
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="threads">My Threads</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>
                    Update your profile information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about yourself" 
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description about your experience and interests
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="websiteUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="portfolioUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Portfolio URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://github.com/username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="programmingLanguages"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Programming Languages</FormLabel>
                            <FormControl>
                              <Input placeholder="JavaScript, Python, Java" {...field} />
                            </FormControl>
                            <FormDescription>
                              Comma-separated list of programming languages you know
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expertise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Areas of Expertise</FormLabel>
                            <FormControl>
                              <Input placeholder="Web Development, Machine Learning, DevOps" {...field} />
                            </FormControl>
                            <FormDescription>
                              Comma-separated list of your expertise areas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full md:w-auto"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="threads">
              <Card>
                <CardHeader>
                  <CardTitle>My Threads</CardTitle>
                  <CardDescription>
                    Threads you've created
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingThreads ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                    </div>
                  ) : userThreads && userThreads.length > 0 ? (
                    <ThreadList threads={userThreads} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't created any threads yet</p>
                      <Button onClick={() => navigate("/categories")}>
                        Browse Categories
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions">
              <Card>
                <CardHeader>
                  <CardTitle>My Subscriptions</CardTitle>
                  <CardDescription>
                    Threads and categories you're subscribed to
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSubscriptions ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                    </div>
                  ) : subscriptions && subscriptions.length > 0 ? (
                    <div className="space-y-4">
                      {subscriptions.map((sub) => (
                        <Card key={sub.id}>
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              {sub.thread && (
                                <div>
                                  <p className="font-medium">Thread: {sub.thread.title}</p>
                                  <Button 
                                    variant="link" 
                                    className="p-0 h-auto" 
                                    onClick={() => navigate(`/threads/${sub.thread.id}`)}
                                  >
                                    View Thread
                                  </Button>
                                </div>
                              )}
                              {sub.category && (
                                <div>
                                  <p className="font-medium">Category: {sub.category.name}</p>
                                  <Button 
                                    variant="link" 
                                    className="p-0 h-auto" 
                                    onClick={() => navigate(`/categories/${sub.category.id}`)}
                                  >
                                    Browse Category
                                  </Button>
                                </div>
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => {
                                // Implement unsubscribe functionality
                                // This would be a mutation to delete the subscription
                              }}
                            >
                              Unsubscribe
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any subscriptions yet</p>
                      <Button onClick={() => navigate("/categories")}>
                        Browse Categories
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
