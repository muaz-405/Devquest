import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import ThreadList from "@/components/ThreadList";
import CreateThreadForm from "@/components/CreateThreadForm";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const categoryId = parseInt(params.id);
  const [, navigate] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  const { 
    data: category,
    isLoading: isLoadingCategory,
    error: categoryError
  } = useQuery({
    queryKey: [`/api/categories/${categoryId}`],
    enabled: !!categoryId && !isNaN(categoryId)
  });

  const { 
    data: threads,
    isLoading: isLoadingThreads,
    error: threadsError
  } = useQuery({
    queryKey: [`/api/categories/${categoryId}/threads`],
    enabled: !!categoryId && !isNaN(categoryId)
  });

  if (isNaN(categoryId)) {
    navigate("/");
    return null;
  }

  if (isLoadingCategory || isLoadingThreads) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Category not found</h2>
          <p className="mt-2 text-gray-600">The category you're looking for doesn't exist or has been removed.</p>
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
        <title>{category.name} | CodeNexus</title>
      </Helmet>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{category.name}</h1>
              <p className="mt-2 text-gray-600">{category.description}</p>
            </div>
            {user && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Thread</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Create a new thread</DialogTitle>
                    <DialogDescription>
                      Start a discussion in the {category.name} category
                    </DialogDescription>
                  </DialogHeader>
                  <CreateThreadForm 
                    categoryId={categoryId} 
                    onSuccess={() => setIsDialogOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {threadsError ? (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <p className="text-red-500">Error loading threads. Please try again.</p>
              </CardContent>
            </Card>
          ) : threads && threads.length > 0 ? (
            <div className="mt-6">
              <ThreadList threads={threads} />
            </div>
          ) : (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>No threads yet</CardTitle>
                <CardDescription>
                  Be the first to start a discussion in this category!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    Create the first thread
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/auth")}>
                    Log in to create a thread
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
