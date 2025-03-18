import { Link } from "wouter";
import { Github, Twitter, Linkedin, Mail, HelpCircle, Phone, MapPin, ShieldCheck, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-t border-gray-700 shadow-xl">
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white inline-flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-blue-400" />
              About Us
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              CodeNexus is a comprehensive programming forum platform that enables developers to connect, share knowledge, and collaborate on coding challenges.
            </p>
            <Link href="/about" className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center transition-colors">
              Learn more <span className="ml-1">→</span>
            </Link>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white inline-flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-green-400" />
              Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Code Snippet Sharing</li>
              <li>• Syntax Highlighting</li>
              <li>• Community Moderation</li>
              <li>• Reputation System</li>
              <li>• Advanced Search</li>
            </ul>
            <Link href="/features" className="text-green-400 hover:text-green-300 text-sm font-medium inline-flex items-center transition-colors">
              All features <span className="ml-1">→</span>
            </Link>
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white inline-flex items-center">
              <FileText className="h-5 w-5 mr-2 text-amber-400" />
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/code-of-conduct" className="text-gray-300 hover:text-white transition-colors">
                  Code of Conduct
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white inline-flex items-center">
              <Mail className="h-5 w-5 mr-2 text-purple-400" />
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <Mail className="h-4 w-4 mt-1 mr-2 text-purple-400" />
                <span>support@codenexus.example</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 mt-1 mr-2 text-purple-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mt-1 mr-2 text-purple-400" />
                <span>123 Coding Street, Developer City, 94043</span>
              </li>
            </ul>
            <Link href="/contact" className="text-purple-400 hover:text-purple-300 text-sm font-medium inline-flex items-center transition-colors">
              Get in touch <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
        
        {/* Social Media Links */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>

            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>

            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CodeNexus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
