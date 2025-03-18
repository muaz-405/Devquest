import { Link } from "wouter";
import { Code, Database, Shield, Server, CodeSquare, BrainCircuit } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  threadCount?: number;
}

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  // Get corresponding icon for category
  const getCategoryIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('javascript') || lowerName.includes('react') || lowerName.includes('typescript')) {
      return <Code className="h-6 w-6" />;
    } else if (lowerName.includes('python')) {
      return <CodeSquare className="h-6 w-6" />;
    } else if (lowerName.includes('database') || lowerName.includes('sql')) {
      return <Database className="h-6 w-6" />;
    } else if (lowerName.includes('security')) {
      return <Shield className="h-6 w-6" />;
    } else if (lowerName.includes('devops')) {
      return <Server className="h-6 w-6" />;
    } else {
      return <BrainCircuit className="h-6 w-6" />;
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="mt-6 text-center py-8 bg-white shadow overflow-hidden sm:rounded-md">
        <p className="text-gray-500">No categories found</p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div 
          key={category.id} 
          className="bg-white overflow-hidden shadow rounded-lg" 
          style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div 
                className="flex-shrink-0 rounded-md p-3"
                style={{ backgroundColor: `${category.color}20` }} // Add transparency to the color
              >
                {getCategoryIcon(category.name)}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {category.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {category.threadCount || 0} threads
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link 
                href={`/categories/${category.id}`}
                className="font-medium hover:underline"
                style={{ color: category.color }}
              >
                View all threads
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
