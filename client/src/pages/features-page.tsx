import { Helmet } from "react-helmet";
import { CheckCircle, Code, Users, MessageSquare, Lock, Search, Clock, Award, Bell, Flag } from "lucide-react";

export default function FeaturesPage() {
  return (
    <>
      <Helmet>
        <title>Features | DevQuest</title>
      </Helmet>
      
      <div className="bg-gradient-to-b from-indigo-900 to-blue-900 text-white py-20">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-sky-300 mb-6">
            Platform Features
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            DevQuest provides a comprehensive platform for developers to connect, share knowledge, and build their professional reputation.
          </p>
        </div>
      </div>
      
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything You Need for Productive Discussions
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              DevQuest provides all the tools necessary for meaningful technical conversations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <div className="p-6">
                <div className="rounded-full bg-emerald-100 p-3 inline-block mb-4">
                  <Code className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Code Sharing</h3>
                <p className="text-gray-600">
                  Share code snippets with syntax highlighting for multiple programming languages. Format your code properly for better readability.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <div className="p-6">
                <div className="rounded-full bg-blue-100 p-3 inline-block mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Organized Discussions</h3>
                <p className="text-gray-600">
                  Discussions are organized by categories and topics, making it easy to find relevant conversations and share your expertise.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <div className="p-6">
                <div className="rounded-full bg-purple-100 p-3 inline-block mb-4">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reputation System</h3>
                <p className="text-gray-600">
                  Build your professional reputation through helpful contributions. Earn badges and recognition as you participate in the community.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <div className="p-6">
                <div className="rounded-full bg-amber-100 p-3 inline-block mb-4">
                  <Bell className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Subscriptions & Notifications</h3>
                <p className="text-gray-600">
                  Subscribe to threads and categories to stay updated. Receive notifications when there are new posts in your subscribed content.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <div className="p-6">
                <div className="rounded-full bg-indigo-100 p-3 inline-block mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">User Profiles</h3>
                <p className="text-gray-600">
                  Detailed user profiles showcase your expertise, activity history, and earned badges. Share your programming knowledge with the community.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <div className="p-6">
                <div className="rounded-full bg-red-100 p-3 inline-block mb-4">
                  <Flag className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Moderation Tools</h3>
                <p className="text-gray-600">
                  Community moderation features ensure discussions remain respectful and on-topic. Flag inappropriate content for moderator review.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <div className="p-6">
                <div className="rounded-full bg-green-100 p-3 inline-block mb-4">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Authentication</h3>
                <p className="text-gray-600">
                  Robust account security with password protection and secure authentication protocols to keep your account information safe.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <div className="p-6">
                <div className="rounded-full bg-cyan-100 p-3 inline-block mb-4">
                  <Search className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Search</h3>
                <p className="text-gray-600">
                  Powerful search functionality helps you find threads, posts, and topics quickly. Filter results by category, user, and more.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <div className="p-6">
                <div className="rounded-full bg-pink-100 p-3 inline-block mb-4">
                  <Clock className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Activity Tracking</h3>
                <p className="text-gray-600">
                  Keep track of your participation and contributions. View your post history, reputation score, and engagement metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Start Your Developer Journey Today
          </h2>
          <div className="inline-flex rounded-md shadow">
            <a href="/auth?tab=register" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 md:py-4 md:text-lg md:px-10">
              Join DevQuest
            </a>
          </div>
          <p className="mt-8 text-gray-600 max-w-2xl mx-auto">
            Join our growing community of developers and start sharing your knowledge, asking questions, and collaborating on solutions to the most challenging problems in tech.
          </p>
        </div>
      </div>
    </>
  );
}