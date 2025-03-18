import { Helmet } from "react-helmet";
import { Code, Users, MessageSquare, GraduationCap, Globe } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Jane Smith",
      role: "Founder & CEO",
      bio: "Full-stack developer with 15+ years experience in building community platforms.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      bio: "Systems architect specializing in scalable applications and cloud infrastructure.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
    },
    {
      name: "Sarah Johnson",
      role: "Lead Designer",
      bio: "UX/UI designer focused on creating accessible and intuitive user interfaces.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
    },
    {
      name: "David Chen",
      role: "Community Manager",
      bio: "Former developer advocate with a passion for building inclusive tech communities.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
    }
  ];

  return (
    <div className="bg-white py-12 sm:py-16">
      <Helmet>
        <title>About Us | CodeNexus</title>
        <meta name="description" content="Learn about CodeNexus, our mission, and the team behind the platform." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            <span className="block">About CodeNexus</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            A community-driven platform where programmers connect, share knowledge, and grow together.
          </p>
        </div>
        
        {/* Our Mission */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                At CodeNexus, we believe that programming knowledge should be accessible to everyone, 
                and that the best way to learn is through community-driven discussion and collaboration.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                We're building a platform where developers of all skill levels can come together to 
                share ideas, solve problems, and advance their programming skills in a supportive 
                environment.
              </p>
              <p className="text-lg text-gray-600">
                Our goal is to create the most inclusive, helpful, and technically accurate 
                programming forum on the web, where quality content rises to the top and everyone 
                feels welcome to participate.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-100 p-6 rounded-xl flex flex-col items-center text-center">
                <Code className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Code Sharing</h3>
                <p className="text-gray-600 text-sm">Enabling developers to share and improve code together</p>
              </div>
              <div className="bg-indigo-100 p-6 rounded-xl flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600 text-sm">Building connections among developers worldwide</p>
              </div>
              <div className="bg-indigo-100 p-6 rounded-xl flex flex-col items-center text-center">
                <MessageSquare className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Discussion</h3>
                <p className="text-gray-600 text-sm">Facilitating meaningful technical conversations</p>
              </div>
              <div className="bg-indigo-100 p-6 rounded-xl flex flex-col items-center text-center">
                <GraduationCap className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Learning</h3>
                <p className="text-gray-600 text-sm">Promoting continuous growth and skill development</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Story */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="prose prose-lg mx-auto text-gray-600">
            <p>
              CodeNexus began in 2023 when a group of developers realized that existing programming 
              forums weren't meeting the needs of modern developers. Too often, these platforms were 
              either outdated, difficult to navigate, or lacked the features that today's programmers need.
            </p>
            <p>
              We set out to create something better — a platform that combines the knowledge-sharing aspects 
              of traditional forums with modern design, code-focused features, and community-building tools.
            </p>
            <p>
              What started as a small community of passionate programmers has grown into a thriving 
              ecosystem of developers from all backgrounds and skill levels. Today, CodeNexus hosts 
              discussions on everything from frontend frameworks to systems programming, machine learning to 
              game development.
            </p>
            <p>
              As we continue to grow, our commitment remains the same: to provide the best possible environment 
              for programmers to connect, learn, and solve problems together.
            </p>
          </div>
        </div>
        
        {/* Our Team */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              The passionate people behind CodeNexus who are dedicated to building the best 
              platform for programmers around the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Join Us CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 sm:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Join Our Global Community</h2>
              <p className="text-indigo-100 max-w-xl">
                Connect with developers from over 150 countries who are sharing knowledge, 
                solving problems, and building the future of technology together.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a 
                href="/auth" 
                className="inline-block bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors duration-300"
              >
                <div className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  <span>Join Now</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}