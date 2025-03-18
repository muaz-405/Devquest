import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CategoriesPage from "@/pages/categories-page";
import CategoryPage from "@/pages/category-page";
import ThreadPage from "@/pages/thread-page";
import ProfilePage from "@/pages/profile-page";
import SearchPage from "@/pages/search-page";
import PopularPage from "@/pages/popular-page";
import RecentPage from "@/pages/recent-page";
import AboutPage from "@/pages/about-page";
import FeaturesPage from "@/pages/features-page";
import PrivacyPage from "@/pages/privacy-page";
import TermsPage from "@/pages/terms-page";
import ContactPage from "@/pages/contact-page";
import { ProtectedRoute } from "@/lib/protected-route";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/categories/:id" component={CategoryPage} />
      <Route path="/threads/:id" component={ThreadPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/popular" component={PopularPage} />
      <Route path="/recent" component={RecentPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/contact" component={ContactPage} />
      <ProtectedRoute path="/profile" component={() => <ProfilePage />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
