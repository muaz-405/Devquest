import { Code, MessageSquare, Users, Bell } from "lucide-react";

export default function Features() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to improve as a developer
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform is designed to help developers of all skill levels connect, share knowledge, and grow together.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Code className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Code Sharing with Syntax Highlighting</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Share code snippets with automatic syntax highlighting for over 100 programming languages. Preserve indentation and structure.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Organized Discussions</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Discussions organized by programming languages, frameworks, and topics for easy navigation and discovery of relevant content.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Personalized Profiles</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Create detailed profiles showcasing your programming languages, expertise, and portfolio links to connect with like-minded developers.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Bell className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Notifications</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Subscribe to threads and categories to get notifications about new posts and updates. Customize notification preferences to your needs.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
