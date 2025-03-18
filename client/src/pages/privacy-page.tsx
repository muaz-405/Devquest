import { Helmet } from "react-helmet";
import { Shield, Eye, Calendar, Server, Lock, Trash, Download, Clock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <Helmet>
        <title>Privacy Policy | CodeNexus</title>
        <meta name="description" content="CodeNexus Privacy Policy - Learn about how we collect, use, and protect your data on our platform." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            <span className="block">Privacy Policy</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Last updated: March 15, 2025
          </p>
        </div>
        
        <div className="prose prose-lg mx-auto text-gray-600">
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Introduction</h2>
            </div>
            <p>
              At CodeNexus, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website and use our platform.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
              policy, please do not access the site.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Eye className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
            </div>
            <p>
              We may collect information about you in a variety of ways. The information we may collect 
              via the platform includes:
            </p>
            <h3>Personal Data</h3>
            <p>
              When you register for an account, we collect:
            </p>
            <ul>
              <li>Your name</li>
              <li>Email address</li>
              <li>Username</li>
              <li>Password (stored in encrypted form)</li>
              <li>Optional profile information (avatar, bio, website, social media links)</li>
            </ul>
            
            <h3>Usage Data</h3>
            <p>
              We may also collect information on how the platform is accessed and used. This usage data 
              may include:
            </p>
            <ul>
              <li>Your computer's Internet Protocol address (IP)</li>
              <li>Browser type</li>
              <li>Browser version</li>
              <li>Pages of our platform that you visit</li>
              <li>Time and date of your visit</li>
              <li>Time spent on those pages</li>
              <li>Other diagnostic data</li>
            </ul>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Server className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Use of Your Information</h2>
            </div>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, 
              and customized experience. Specifically, we may use information collected about you via the 
              platform to:
            </p>
            <ul>
              <li>Create and maintain your account</li>
              <li>Provide and deliver the services you request</li>
              <li>Send you service and platform updates</li>
              <li>Email you regarding your account or activity</li>
              <li>Send you emails about platform updates, features, and news</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Provide technical support and troubleshooting</li>
              <li>Prevent fraudulent activity or abuse of our services</li>
              <li>Improve the platform and user experience</li>
              <li>Monitor and analyze usage and trends</li>
            </ul>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Lock className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Security of Your Information</h2>
            </div>
            <p>
              We use administrative, technical, and physical security measures to help protect your 
              personal information. While we have taken reasonable steps to secure the personal 
              information you provide to us, please be aware that despite our efforts, no security 
              measures are perfect or impenetrable, and no method of data transmission can be 
              guaranteed against any interception or other type of misuse.
            </p>
            <p>
              Any information disclosed online is vulnerable to interception and misuse by 
              unauthorized parties. Therefore, we cannot guarantee complete security if you provide 
              personal information.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Clock className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Data Retention</h2>
            </div>
            <p>
              We will retain your personal information only for as long as is necessary for the 
              purposes set out in this privacy policy. We will retain and use your information to the 
              extent necessary to comply with our legal obligations, resolve disputes, and enforce our 
              policies.
            </p>
            <p>
              User account data is retained while your account is active. If you delete your account, 
              we will delete or anonymize your personal data within 30 days, except where we are required 
              to retain the data to comply with legal obligations or to protect our interests.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Download className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Your Data Rights</h2>
            </div>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>
                <strong>Right to Access:</strong> You can request copies of your personal information.
              </li>
              <li>
                <strong>Right to Rectification:</strong> You can request that we correct any information you believe is inaccurate or complete information you believe is incomplete.
              </li>
              <li>
                <strong>Right to Erasure:</strong> You can request that we erase your personal information, under certain conditions.
              </li>
              <li>
                <strong>Right to Restrict Processing:</strong> You can request that we restrict the processing of your personal information, under certain conditions.
              </li>
              <li>
                <strong>Right to Data Portability:</strong> You can request that we transfer the data we've collected to another organization, or directly to you, under certain conditions.
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Policy Updates</h2>
            </div>
            <p>
              We may update this privacy policy from time to time in order to reflect changes to our 
              practices or for other operational, legal, or regulatory reasons. We will notify you of 
              any material changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to 
              this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Trash className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Account Deletion</h2>
            </div>
            <p>
              You can delete your account at any time by going to your account settings and selecting 
              the option to delete your account. When you delete your account, we will delete or 
              anonymize your personal information within 30 days, except where we are required to retain 
              the information to comply with legal obligations.
            </p>
            <p>
              Note that content you have shared publicly on the platform (such as posts, comments, and 
              code snippets) may remain visible even after your account is deleted, although they will 
              be disassociated from your identity.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p><strong>CodeNexus, Inc.</strong></p>
              <p>123 Coding Street</p>
              <p>Developer City, 94043</p>
              <p>Email: privacy@codenexus.example</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}