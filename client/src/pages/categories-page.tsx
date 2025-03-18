import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import CategoryList from "@/components/CategoryList";

export default function CategoriesPage() {
  const { 
    data: categories, 
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !categories) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Error loading categories</h2>
          <p className="mt-2 text-gray-600">Unable to load categories. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Categories | CodeNexus</title>
      </Helmet>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Discussion Categories</h1>
            <p className="mt-4 text-xl text-gray-500">
              Browse all categories on CodeNexus
            </p>
          </div>

          <CategoryList categories={categories} />
        </div>
      </div>
    </>
  );
}