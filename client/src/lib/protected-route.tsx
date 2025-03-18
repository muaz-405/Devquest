import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.ReactElement;
}) {
  const { user, isLoading } = useAuth();
  
  return (
    <Route path={path}>
      {() => {
        // Only show loading if still fetching user data
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          );
        }

        // Redirect to auth page if no user is logged in
        if (!user) {
          return <Redirect to="/auth" />;
        }

        // Render the protected component if user is logged in
        return <Component />;
      }}
    </Route>
  );
}
