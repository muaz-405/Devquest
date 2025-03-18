import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function Hero() {
  const { user } = useAuth();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-900 to-blue-900">
      {/* Abstract pattern background - SVG pattern which looks like code/network connections */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 10 L40 10 M10 0 L10 40 M0 20 L40 20 M20 0 L20 40 M0 30 L40 30 M30 0 L30 40" stroke="white" strokeWidth="1" fill="none" />
            </pattern>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#dots)" />
          <g fill="none" stroke="white" strokeWidth="2" opacity="0.3">
            <path d="M0,50 Q50,0 100,50 Q150,100 200,50" />
            <path d="M-100,150 Q0,100 100,150 Q200,200 300,150" />
            <path d="M-100,250 Q0,200 100,250 Q200,300 300,250" />
          </g>
        </svg>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="block">Connect with developers</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-sky-300">
              Share knowledge. Grow together.
            </span>
          </h1>
          <p className="mt-6 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
            Join our growing community of programmers, share your code, ask questions, and collaborate on solutions to the most challenging problems in tech.
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
            {!user ? (
              <>
                <div className="rounded-md shadow">
                  <Link href="/auth?tab=register">
                    <Button className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10 bg-gradient-to-r from-emerald-400 to-sky-500 hover:from-emerald-500 hover:to-sky-600">
                      Join the community
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link href="/auth">
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10 bg-white text-indigo-800 font-medium border-2 border-white hover:bg-white/90 hover:text-indigo-900 transition-all">
                      Log in
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-md shadow">
                  <Link href="/categories">
                    <Button className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10 bg-gradient-to-r from-emerald-400 to-sky-500 hover:from-emerald-500 hover:to-sky-600">
                      Browse discussions
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link href="/profile">
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 border border-transparent md:py-4 md:text-lg md:px-10 text-white border-white/30 hover:bg-white/10">
                      View profile
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
