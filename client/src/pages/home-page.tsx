import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ThreadList from "@/components/ThreadList";
import CategoryList from "@/components/CategoryList";
import CodeBlock from "@/components/CodeBlock";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  // Fetch threads
  const { 
    data: threads,
    isLoading: isLoadingThreads,
    error: threadsError
  } = useQuery({
    queryKey: ["/api/threads"],
  });

  // Fetch categories
  const { 
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="bg-gray-50">
      <Hero />
      <Features />
      
      {/* Popular discussions */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 mb-4">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <span className="text-sm font-medium">Trending Now</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Popular Discussions
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-400 to-sky-500 rounded my-4"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl">
              Join these active discussions or start your own thread. 
              Share your knowledge with our growing community of developers.
            </p>
          </div>
          
          {isLoadingThreads ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary-500 mb-4" />
                <p className="text-gray-500">Loading discussions...</p>
              </div>
            </div>
          ) : threadsError ? (
            <div className="py-12 text-center text-red-500 bg-red-50 rounded-lg border border-red-200 shadow-sm p-6">
              <div className="text-xl font-semibold mb-2">Failed to load discussions</div>
              <p>Please try again or check your connection</p>
            </div>
          ) : threads && threads.length > 0 ? (
            <div className="relative">
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-50 -m-6 rounded-xl -z-10"></div>
              <ThreadList threads={threads} />
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-medium text-gray-700 mb-4">No discussions yet</h3>
              <p className="text-gray-500 mb-6">Be the first to start a meaningful discussion!</p>
              <Link href="/auth?tab=register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-emerald-400 to-sky-500 hover:from-emerald-500 hover:to-sky-600">
                Join and Create a Thread
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Code sample section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 mb-4">
              <span className="text-sm font-medium">Code Examples</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Powerful Code Sharing
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-400 to-indigo-500 rounded my-4"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl">
              Share code snippets with syntax highlighting for better discussions and problem-solving.
            </p>
          </div>
          
          <div className="relative mt-12 lg:mt-16">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-lg font-medium text-gray-900">
                Example Components
              </span>
            </div>
          </div>
          
          {/* Grid container for code examples */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* React Animation Component Box */}
            <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md p-3 text-white shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 9a9 9 0 0 1 9 3"></path>
                        <path d="M12 9a9 9 0 0 0-9 3"></path>
                        <path d="M12 15a9 9 0 0 0 9-3"></path>
                        <path d="M12 15a9 9 0 0 1-9-3"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">React Animation Component</h3>
                      <p className="text-gray-500 text-sm">Smooth entrance animations</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 overflow-auto max-h-[400px] border border-gray-100">
                    <CodeBlock 
                      code={`import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  className?: string;
}

export function FadeIn({
  children,
  duration = 0.5,
  delay = 0,
  direction = 'up',
  distance = 50,
  className = '',
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);
  
  // Get transform property based on direction
  const getTransform = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return { y: distance };
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={{ opacity: 0, ...getTransform() }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            y: 0,
            transition: {
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1.0],
            }, 
          }}
          exit={{ opacity: 0, ...getTransform() }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}`} 
                      language="tsx" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Advanced React Hook Box */}
            <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-md p-3 text-white shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                        <line x1="16" y1="8" x2="2" y2="22"></line>
                        <line x1="17.5" y1="15" x2="9" y2="15"></line>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">useLocalStorage Hook</h3>
                      <p className="text-gray-500 text-sm">Persistent state management</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 overflow-auto max-h-[400px] border border-gray-100">
                    <CodeBlock 
                      code={`import { useState, useEffect } from 'react';

function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get stored value or use initialValue
  const getStoredValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  };

  // State to store the value
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);
  
  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}`} 
                      language="tsx" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* React UI Component Box */}
            <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-600/10 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-r from-pink-500 to-rose-600 rounded-md p-3 text-white shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">Dropdown Menu Component</h3>
                      <p className="text-gray-500 text-sm">Accessible dropdown interface</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 overflow-auto max-h-[400px] border border-gray-100">
                    <CodeBlock 
                      code={`import React, { useState, useRef, useEffect } from 'react';

type DropdownOption = {
  id: string;
  label: string;
  value: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  className = '',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === value);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
    }
  };
  
  return (
    <div 
      className={\`relative \${className}\`}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 
                   rounded-md shadow-sm focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <svg 
            className="w-5 h-5 text-gray-400" 
            viewBox="0 0 20 20" 
            fill="none" 
            stroke="currentColor"
          >
            <path 
              d="M7 7l3-3 3 3m0 6l-3 3-3-3" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </span>
      </button>
      
      {isOpen && (
        <ul 
          className="absolute z-10 w-full mt-1 bg-white shadow-lg 
                     max-h-60 rounded-md py-1 text-base ring-1 
                     ring-black ring-opacity-5 overflow-auto 
                     focus:outline-none sm:text-sm"
          tabIndex={-1}
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.id}
              className={\`\${
                option.value === value
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-900'
              } cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100\`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
              
              {option.value === value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};`} 
                      language="tsx" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Advanced React Form Grid Box */}
            <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-600/10 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-md p-3 text-white shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <path d="M8 12h8"></path>
                        <path d="M12 8v8"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">Form Grid Layout</h3>
                      <p className="text-gray-500 text-sm">Responsive form layouts with Grid</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 overflow-auto max-h-[400px] border border-gray-100">
                    <CodeBlock 
                      code={`import React from 'react';

// Simple reusable components
const FormLabel = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    {children}
  </label>
);

const FormInput = ({ id, type = "text", ...props }) => (
  <input
    id={id}
    type={type}
    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 
              block w-full sm:text-sm border-gray-300 rounded-md"
    {...props}
  />
);

const FormSection = ({ title, children }) => (
  <div className="border-b border-gray-200 pb-5 mb-5">
    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
      {title}
    </h3>
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
      {children}
    </div>
  </div>
);

// Main component
export default function GridForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FormSection title="Personal Information">
        <div className="sm:col-span-3">
          <FormLabel htmlFor="first-name">First name</FormLabel>
          <FormInput id="first-name" />
        </div>

        <div className="sm:col-span-3">
          <FormLabel htmlFor="last-name">Last name</FormLabel>
          <FormInput id="last-name" />
        </div>

        <div className="sm:col-span-4">
          <FormLabel htmlFor="email">Email address</FormLabel>
          <FormInput id="email" type="email" />
        </div>

        <div className="sm:col-span-2">
          <FormLabel htmlFor="phone">Phone</FormLabel>
          <FormInput id="phone" type="tel" />
        </div>
      </FormSection>

      <FormSection title="Address Information">
        <div className="sm:col-span-6">
          <FormLabel htmlFor="street">Street address</FormLabel>
          <FormInput id="street" />
        </div>

        <div className="sm:col-span-2">
          <FormLabel htmlFor="city">City</FormLabel>
          <FormInput id="city" />
        </div>

        <div className="sm:col-span-2">
          <FormLabel htmlFor="state">State / Province</FormLabel>
          <FormInput id="state" />
        </div>

        <div className="sm:col-span-2">
          <FormLabel htmlFor="zip">ZIP / Postal code</FormLabel>
          <FormInput id="zip" />
        </div>
      </FormSection>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md
                      shadow-sm text-sm font-medium text-gray-700 
                      hover:bg-gray-50 focus:outline-none focus:ring-2 
                      focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border 
                      border-transparent shadow-sm text-sm font-medium 
                      rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                      focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}`} 
                      language="jsx" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Python Async Example Box */}
            <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-md p-3 text-white shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">Python Async Example</h3>
                      <p className="text-gray-500 text-sm">Concurrent processing with asyncio</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 overflow-auto max-h-[400px] border border-gray-100">
                    <CodeBlock 
                      code={`import asyncio
import aiohttp
from typing import Dict, List, Any, Optional

class AsyncDataFetcher:
    """A class for efficiently fetching data from multiple APIs concurrently"""
    
    def __init__(self, base_url: str, timeout: int = 30):
        self.base_url = base_url
        self.timeout = timeout
        self._session: Optional[aiohttp.ClientSession] = None
    
    async def __aenter__(self):
        self._session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=self.timeout)
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self._session:
            await self._session.close()
            self._session = None
    
    async def fetch_endpoint(self, endpoint: str, 
                           params: Dict = None) -> Dict[str, Any]:
        """Fetch data from a specific API endpoint"""
        if not self._session:
            raise RuntimeError("Session not initialized. Use as context manager.")
            
        url = f"{self.base_url}/{endpoint}"
        try:
            async with self._session.get(url, params=params) as response:
                if response.status != 200:
                    return {
                        'error': f'HTTP error {response.status}', 
                        'details': await response.text()
                    }
                    
                return await response.json()
        except asyncio.TimeoutError:
            return {'error': 'Request timed out'}
        except Exception as e:
            return {'error': str(e)}
    
    async def fetch_multiple(self, endpoints: List[str]) -> Dict[str, Any]:
        """Fetch data from multiple endpoints concurrently"""
        tasks = [self.fetch_endpoint(endpoint) for endpoint in endpoints]
        results = await asyncio.gather(*tasks)
        return dict(zip(endpoints, results))`} 
                      language="python" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* State Management Box */}
            <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-600/10 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-md p-3 text-white shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 20V10"></path>
                        <path d="M12 20V4"></path>
                        <path d="M6 20v-6"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">React State Management</h3>
                      <p className="text-gray-500 text-sm">Creating custom state providers</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 overflow-auto max-h-[400px] border border-gray-100">
                    <CodeBlock 
                      code={`import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the state type
type State = {
  count: number;
  darkMode: boolean;
};

// Define action types
type Action =
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number }
  | { type: 'TOGGLE_DARK_MODE' };

// Initial state
const initialState: State = {
  count: 0,
  darkMode: false,
};

// Create the context
type AppContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + action.payload };
    case 'DECREMENT':
      return { ...state, count: state.count - action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
}

// Usage example
function CounterComponent() {
  const { state, dispatch } = useAppContext();
  
  return (
    <div className={state.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT', payload: 1 })}>
        Increment
      </button>
      <button onClick={() => dispatch({ type: 'DECREMENT', payload: 1 })}>
        Decrement
      </button>
      <button onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}>
        Toggle Dark Mode
      </button>
    </div>
  );
}`} 
                      language="tsx" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 mb-4">
              <span className="text-sm font-medium">Topics & Languages</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
              Explore Categories
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded my-4"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl">
              Find discussions in your favorite programming languages and topics. Join communities tailored to your interests.
            </p>
          </div>
          
          {isLoadingCategories ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-amber-500 mb-4" />
                <p className="text-gray-500">Loading categories...</p>
              </div>
            </div>
          ) : categoriesError ? (
            <div className="py-12 text-center text-red-500 bg-red-50 rounded-lg border border-red-200 shadow-sm p-6 max-w-2xl mx-auto">
              <div className="text-xl font-semibold mb-2">Failed to load categories</div>
              <p>Please try again or check your connection</p>
            </div>
          ) : (
            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              <CategoryList categories={categories} />
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link href="/categories" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
              View All Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
