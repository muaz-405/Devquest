import { Helmet } from "react-helmet";
import { FileText, User, MessageSquare, AlertTriangle, Code } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <Helmet>
        <title>Terms of Service | CodeNexus</title>
        <meta name="description" content="CodeNexus Terms of Service - The rules and guidelines for using our platform." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            <span className="block">Terms of Service</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Last updated: March 15, 2025
          </p>
        </div>
        
        <div className="prose prose-lg mx-auto text-gray-600">
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Introduction</h2>
            </div>
            <p>
              Welcome to CodeNexus. These Terms of Service ("Terms") govern your access to and use of the 
              CodeNexus website, services, and applications (collectively, the "Service"). By accessing or 
              using the Service, you agree to be bound by these Terms. If you disagree with any part of the 
              Terms, you may not access the Service.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <User className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Your Account</h2>
            </div>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information 
              at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate 
              termination of your account on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any 
              activities or actions under your password. You agree not to disclose your password to any third 
              party. You must notify us immediately upon becoming aware of any breach of security or unauthorized 
              use of your account.
            </p>
            <p>
              You may not use as a username the name of another person or entity or that is not lawfully available 
              for use, a name or trademark that is subject to any rights of another person or entity without 
              appropriate authorization, or a name that is offensive, vulgar, or obscene.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Code className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Content and Intellectual Property</h2>
            </div>
            <h3>Your Content</h3>
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, 
              text, graphics, videos, or other material ("Content"). You are responsible for the Content that you 
              post on or through the Service, including its legality, reliability, and appropriateness.
            </p>
            <p>
              By posting Content on or through the Service, you represent and warrant that:
            </p>
            <ul>
              <li>
                The Content is yours (you own it) or you have the right to use it and grant us the rights and license 
                as provided in these Terms.
              </li>
              <li>
                The posting of your Content on or through the Service does not violate the privacy rights, publicity 
                rights, copyrights, contract rights or any other rights of any person or entity.
              </li>
            </ul>
            <p>
              You retain any and all of your rights to any Content you submit, post or display on or through the 
              Service and you are responsible for protecting those rights. We take no responsibility and assume no 
              liability for Content you or any third party posts on or through the Service.
            </p>
            
            <h3>License Grant</h3>
            <p>
              By posting Content on or through the Service, you grant us a worldwide, non-exclusive, royalty-free 
              license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, 
              transmit, display and distribute such Content in any and all media or distribution methods now known 
              or later developed.
            </p>
            <p>
              This license is for the limited purpose of operating, promoting, and improving our Service, and to 
              develop new ones. This license continues even if you stop using our Service, unless you delete 
              your Content.
            </p>
            
            <h3>Code Snippets and Examples</h3>
            <p>
              Unless otherwise stated, code snippets and examples posted on the Service are considered to be 
              shared under the MIT License, allowing others to use, modify, and distribute them freely, both for 
              personal and commercial purposes, provided that appropriate attribution is given.
            </p>
            <p>
              If you wish to apply a different license to your code, you must clearly state this in your post.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Community Guidelines</h2>
            </div>
            <p>
              In order to maintain a positive and productive community, we ask that you adhere to the following guidelines:
            </p>
            <h3>Do:</h3>
            <ul>
              <li>Be respectful and constructive in discussions</li>
              <li>Provide context and clear descriptions when asking questions</li>
              <li>Use appropriate formatting for code snippets</li>
              <li>Give attribution when using others' work</li>
              <li>Report inappropriate content or behavior</li>
            </ul>
            
            <h3>Don't:</h3>
            <ul>
              <li>Post offensive, harmful, or discriminatory content</li>
              <li>Spam or post irrelevant content</li>
              <li>Share personal information without consent</li>
              <li>Impersonate others</li>
              <li>Post content that violates intellectual property rights</li>
              <li>Engage in any illegal activities</li>
            </ul>
            
            <p>
              We reserve the right to remove any content that violates these guidelines and to 
              suspend or terminate accounts for repeated violations.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Disclaimer and Limitation of Liability</h2>
            </div>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and 
              "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether 
              express or implied.
            </p>
            <p>
              CodeNexus, its subsidiaries, affiliates, and its licensors do not warrant that:
            </p>
            <ul>
              <li>The Service will function uninterrupted, secure or available at any particular time or location</li>
              <li>Any errors or defects will be corrected</li>
              <li>The Service is free of viruses or other harmful components</li>
              <li>The results of using the Service will meet your requirements</li>
            </ul>
            
            <p>
              In no event shall CodeNexus, nor its directors, employees, partners, agents, suppliers, or 
              affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
              resulting from:
            </p>
            <ul>
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use or alteration of your transmissions or content</li>
            </ul>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
              revision is material we will provide at least 30 days' notice prior to any new terms taking effect. 
              What constitutes a material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after any revisions become effective, you agree to be 
              bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to 
              use the Service.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the United States, 
              without regard to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of 
              those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, 
              the remaining provisions of these Terms will remain in effect.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p><strong>CodeNexus, Inc.</strong></p>
              <p>123 Coding Street</p>
              <p>Developer City, 94043</p>
              <p>Email: terms@codenexus.example</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}