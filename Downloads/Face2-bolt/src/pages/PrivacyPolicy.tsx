import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Privacy Policy</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Privacy <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-lg text-gray-600">
              Last Updated: January 15, 2024
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 prose prose-lg max-w-none">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 not-prose">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
                <p className="text-sm text-gray-600">We're clear about what data we collect and how we use it</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <Lock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                <p className="text-sm text-gray-600">Your data is protected with enterprise-grade security</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Control</h3>
                <p className="text-sm text-gray-600">You have full control over your data and privacy settings</p>
              </div>
            </div>

            <h2>1. Information We Collect</h2>

            <h3>1.1 Account Information</h3>
            <p>
              When you create a MedSpaGen account, we collect:
            </p>
            <ul>
              <li>Name and email address</li>
              <li>Practice or business name</li>
              <li>Password (encrypted)</li>
              <li>Profile information you choose to provide</li>
            </ul>

            <h3>1.2 Content and Usage Data</h3>
            <p>
              To provide our video generation services, we collect:
            </p>
            <ul>
              <li>Before and after images you upload</li>
              <li>Video generation preferences and settings</li>
              <li>Generated videos and associated metadata</li>
              <li>Usage patterns and feature interactions</li>
            </ul>

            <h3>1.3 Technical Information</h3>
            <p>
              We automatically collect technical data including:
            </p>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Usage analytics and performance metrics</li>
            </ul>

            <h2>2. How We Use Your Information</h2>

            <h3>2.1 Service Provision</h3>
            <p>
              We use your information to:
            </p>
            <ul>
              <li>Process your images and generate videos using AI technology</li>
              <li>Maintain your account and provide customer support</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important service notifications and updates</li>
            </ul>

            <h3>2.2 Service Improvement</h3>
            <p>
              We analyze usage data to:
            </p>
            <ul>
              <li>Improve our AI algorithms and video quality</li>
              <li>Develop new features and capabilities</li>
              <li>Optimize performance and user experience</li>
              <li>Identify and fix technical issues</li>
            </ul>

            <h3>2.3 Communication</h3>
            <p>
              With your consent, we may send:
            </p>
            <ul>
              <li>Product updates and feature announcements</li>
              <li>Educational content and best practices</li>
              <li>Marketing communications about our services</li>
            </ul>

            <h2>3. Data Sharing and Disclosure</h2>

            <h3>3.1 No Sale of Personal Data</h3>
            <p>
              We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
            </p>

            <h3>3.2 Service Providers</h3>
            <p>
              We may share data with trusted service providers who help us operate our service:
            </p>
            <ul>
              <li>Cloud hosting and storage providers (AWS, Google Cloud)</li>
              <li>Payment processors (Stripe)</li>
              <li>Analytics and monitoring services</li>
              <li>Customer support tools</li>
            </ul>
            <p>
              All service providers are bound by strict data processing agreements.
            </p>

            <h3>3.3 Legal Requirements</h3>
            <p>
              We may disclose information when required by law or to:
            </p>
            <ul>
              <li>Comply with legal processes or government requests</li>
              <li>Protect the rights and safety of our users</li>
              <li>Investigate fraud or security issues</li>
              <li>Enforce our Terms of Service</li>
            </ul>

            <h2>4. Data Security and Retention</h2>

            <h3>4.1 Security Measures</h3>
            <p>
              We implement comprehensive security measures:
            </p>
            <ul>
              <li>End-to-end encryption for data transmission</li>
              <li>Secure data storage with access controls</li>
              <li>Regular security audits and assessments</li>
              <li>Employee security training and access limitations</li>
            </ul>

            <h3>4.2 Data Retention</h3>
            <p>
              We retain your data as follows:
            </p>
            <ul>
              <li><strong>Account Data:</strong> Until you delete your account</li>
              <li><strong>Generated Videos:</strong> As long as your account is active</li>
              <li><strong>Usage Analytics:</strong> Up to 2 years for service improvement</li>
              <li><strong>Payment Records:</strong> As required by law (typically 7 years)</li>
            </ul>

            <h2>5. Your Privacy Rights</h2>

            <h3>5.1 Access and Control</h3>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access all personal data we have about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in a portable format</li>
            </ul>

            <h3>5.2 Communication Preferences</h3>
            <p>
              You can control communications by:
            </p>
            <ul>
              <li>Updating email preferences in your account settings</li>
              <li>Unsubscribing from marketing emails</li>
              <li>Contacting support to opt-out of specific communications</li>
            </ul>

            <h3>5.3 California Privacy Rights (CCPA)</h3>
            <p>
              California residents have additional rights including:
            </p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discriminatory treatment</li>
            </ul>

            <h2>6. International Data Transfers</h2>
            <p>
              MedSpaGen operates globally. Your data may be processed in the United States and other countries where we have facilities or service providers. We ensure appropriate safeguards are in place for international data transfers, including:
            </p>
            <ul>
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Certification schemes like Privacy Shield successors</li>
            </ul>

            <h2>7. Children's Privacy</h2>
            <p>
              MedSpaGen is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will delete that information promptly.
            </p>

            <h2>8. Cookies and Tracking</h2>

            <h3>8.1 Cookie Usage</h3>
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul>
              <li>Maintain your session and login state</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze usage patterns and improve our service</li>
              <li>Provide personalized content and features</li>
            </ul>

            <h3>8.2 Cookie Management</h3>
            <p>
              You can control cookies through your browser settings. Note that disabling certain cookies may limit functionality of our service.
            </p>

            <h2>9. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will:
            </p>
            <ul>
              <li>Post the updated policy on our website</li>
              <li>Update the "Last Updated" date</li>
              <li>Notify users of material changes via email</li>
              <li>Provide at least 30 days notice for significant changes</li>
            </ul>

            <h2>10. Contact Information</h2>
            <p>
              For questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@medspagen.com</li>
              <li><strong>Address:</strong> MedSpaGen Inc., 741 Lakefield Road Suite G, Thousand Oaks, CA 91361</li>
              <li><strong>Phone:</strong> (323) 638-7499</li>
            </ul>

            <div className="mt-12 p-6 bg-blue-50 rounded-xl not-prose">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Questions About Your Privacy?</h3>
              <p className="text-blue-800 mb-4">
                We're committed to protecting your privacy and being transparent about our practices. 
                If you have any questions or concerns, please don't hesitate to reach out to our privacy team.
              </p>
              <a 
                href="mailto:privacy@medspagen.com" 
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Contact Privacy Team
              </a>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;