import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search as SearchIcon } from "lucide-react";
import ThreadList from "@/components/ThreadList";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

export default function SearchPage() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("threads");
  
  // Extract search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [location]);
  
  // Perform search
  const { 
    data: searchResults,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [`/api/search?q=${encodeURIComponent(searchQuery)}`],
    enabled: searchQuery.length >= 3,
  });
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      const newLocation = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      window.history.replaceState(null, "", newLocation);
      refetch();
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Search | CodeNexus</title>
      </Helmet>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Search results</h1>
            <p className="mt-2 text-gray-600">Find discussions, code snippets, and answers</p>
          </div>
          
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  className="pl-10"
                  placeholder="Search for keywords, topics, or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  minLength={3}
                />
              </div>
              <Button type="submit" disabled={searchQuery.trim().length < 3}>
                Search
              </Button>
            </form>
            {searchQuery.trim().length > 0 && searchQuery.trim().length < 3 && (
              <p className="mt-2 text-sm text-red-500">Search query must be at least 3 characters</p>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-red-500">
                  <p>Error performing search. Please try again.</p>
                </div>
              </CardContent>
            </Card>
          ) : searchResults ? (
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="threads">
                    Threads ({searchResults.threads?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="posts">
                    Posts ({searchResults.posts?.length || 0})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="threads">
                  {searchResults.threads && searchResults.threads.length > 0 ? (
                    <ThreadList threads={searchResults.threads} />
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <p className="text-gray-500">No threads found matching "{searchQuery}"</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="posts">
                  {searchResults.posts && searchResults.posts.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.posts.map((post) => (
                        <Card key={post.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              <Link href={`/threads/${post.thread?.id}#post-${post.id}`}>
                                <a className="text-primary-600 hover:underline">
                                  {post.thread?.title || "Thread"}
                                </a>
                              </Link>
                            </CardTitle>
                            <CardDescription>
                              By {post.user?.name || "Anonymous"} • {
                                post.createdAt && formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                              }
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div 
                              className="prose max-w-none" 
                              dangerouslySetInnerHTML={{ 
                                __html: post.content.length > 200 
                                  ? post.content.substring(0, 200) + "..."
                                  : post.content
                              }}
                            />
                            <div className="mt-4">
                              <Link href={`/threads/${post.thread?.id}#post-${post.id}`}>
                                <Button variant="link" className="p-0 h-auto">
                                  Read full post
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <p className="text-gray-500">No posts found matching "{searchQuery}"</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : searchQuery.length >= 3 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">No results found. Try different keywords.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">Enter at least 3 characters to search</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
