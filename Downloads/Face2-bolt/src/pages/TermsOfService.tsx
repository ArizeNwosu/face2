import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, Scale, Shield, AlertTriangle } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              <span>Terms of Service</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Terms of <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-lg text-gray-600">
              Last Updated: January 15, 2024
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 prose prose-lg max-w-none">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 not-prose">
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <Scale className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Fair Terms</h3>
                <p className="text-sm text-gray-600">Balanced agreements that protect both parties</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Your Rights</h3>
                <p className="text-sm text-gray-600">Clear explanation of your rights and our obligations</p>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Important Info</h3>
                <p className="text-sm text-gray-600">Key terms and limitations you should know</p>
              </div>
            </div>

            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to MedSpaGen. By accessing or using our service, you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of these terms, then you may not access the service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              MedSpaGen is an AI-powered platform that generates professional before-and-after videos for medical spas, 
              aesthetic practices, and healthcare providers. Our service includes:
            </p>
            <ul>
              <li>AI-powered video generation from before/after images</li>
              <li>Customizable animation styles and effects</li>
              <li>High-quality video downloads</li>
              <li>Account dashboard and video management tools</li>
              <li>Customer support and documentation</li>
            </ul>

            <h2>3. User Accounts</h2>

            <h3>3.1 Account Creation</h3>
            <p>
              To access certain features of our service, you must register for an account. When creating an account, you must:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h3>3.2 Account Responsibility</h3>
            <p>
              You are responsible for all activities that occur under your account. You agree to:
            </p>
            <ul>
              <li>Use the service only for lawful purposes</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not share your account credentials with others</li>
              <li>Accept responsibility for all account activity</li>
            </ul>

            <h2>4. Acceptable Use Policy</h2>

            <h3>4.1 Permitted Uses</h3>
            <p>
              You may use MedSpaGen to:
            </p>
            <ul>
              <li>Create professional marketing content for legitimate medical/aesthetic practices</li>
              <li>Generate educational materials for patient consultation</li>
              <li>Produce content for social media and website marketing</li>
              <li>Create presentations for conferences and training</li>
            </ul>

            <h3>4.2 Prohibited Uses</h3>
            <p>
              You agree not to use the service to:
            </p>
            <ul>
              <li>Upload images without proper consent from subjects</li>
              <li>Create misleading or false medical claims</li>
              <li>Generate content for illegal or unethical practices</li>
              <li>Violate any individual's privacy or publicity rights</li>
              <li>Upload copyrighted material without permission</li>
              <li>Create content that promotes dangerous or harmful procedures</li>
              <li>Attempt to reverse engineer or circumvent our AI technology</li>
            </ul>

            <h2>5. Content and Intellectual Property</h2>

            <h3>5.1 Your Content</h3>
            <p>
              You retain all rights to the images you upload ("Your Content"). By uploading content, you grant us:
            </p>
            <ul>
              <li>A worldwide, non-exclusive license to process your images</li>
              <li>The right to use AI technology to generate videos</li>
              <li>Permission to store and backup your content</li>
              <li>The right to provide technical support</li>
            </ul>

            <h3>5.2 Generated Videos</h3>
            <p>
              Videos generated by our service are owned by you. We provide you with:
            </p>
            <ul>
              <li>Full commercial usage rights</li>
              <li>The right to modify and distribute the videos</li>
              <li>Unlimited usage across all platforms and media</li>
            </ul>

            <h3>5.3 Our Intellectual Property</h3>
            <p>
              The MedSpaGen platform, including our AI technology, algorithms, and software, remains our exclusive property. 
              You may not:
            </p>
            <ul>
              <li>Copy, modify, or reverse engineer our technology</li>
              <li>Create derivative works based on our platform</li>
              <li>Remove or alter proprietary notices</li>
            </ul>

            <h2>6. Payment Terms</h2>

            <h3>6.1 Subscription Plans</h3>
            <p>
              MedSpaGen offers various subscription plans with different features and usage limits. 
              Subscription fees are:
            </p>
            <ul>
              <li>Charged monthly or annually as selected</li>
              <li>Non-refundable except as required by law</li>
              <li>Subject to change with 30 days advance notice</li>
            </ul>

            <h3>6.2 Payment Processing</h3>
            <p>
              Payments are processed securely through Stripe. By providing payment information, you:
            </p>
            <ul>
              <li>Authorize us to charge your payment method</li>
              <li>Agree to pay all charges incurred</li>
              <li>Are responsible for all applicable taxes</li>
            </ul>

            <h3>6.3 Cancellation and Refunds</h3>
            <p>
              You may cancel your subscription at any time. Upon cancellation:
            </p>
            <ul>
              <li>You retain access until the end of your billing period</li>
              <li>No refunds are provided for partial periods</li>
              <li>Your account and data will be preserved for 90 days</li>
            </ul>

            <h2>7. Service Availability and Modifications</h2>

            <h3>7.1 Service Availability</h3>
            <p>
              We strive to maintain high service availability but do not guarantee uninterrupted access. 
              Service may be temporarily unavailable due to:
            </p>
            <ul>
              <li>Scheduled maintenance and updates</li>
              <li>Technical issues or system failures</li>
              <li>Force majeure events beyond our control</li>
            </ul>

            <h3>7.2 Service Modifications</h3>
            <p>
              We reserve the right to modify or discontinue the service with reasonable notice. 
              We may update features, pricing, or terms as needed to improve the service.
            </p>

            <h2>8. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed by our 
              <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>, 
              which is incorporated into these Terms by reference.
            </p>
            <p>
              We implement appropriate security measures to protect your data and comply with applicable privacy laws, 
              including GDPR and CCPA.
            </p>

            <h2>9. Medical and Healthcare Compliance</h2>

            <h3>9.1 Professional Responsibility</h3>
            <p>
              As a healthcare professional using our service, you are responsible for:
            </p>
            <ul>
              <li>Ensuring all content complies with medical advertising regulations</li>
              <li>Obtaining proper patient consent for image usage</li>
              <li>Maintaining accuracy in before/after representations</li>
              <li>Following applicable medical board guidelines</li>
            </ul>

            <h3>9.2 No Medical Advice</h3>
            <p>
              MedSpaGen is a content creation tool only. We do not provide medical advice, recommendations, 
              or endorsements of any treatments or procedures.
            </p>

            <h2>10. Disclaimers and Limitations of Liability</h2>

            <h3>10.1 Service Disclaimers</h3>
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
              EXPRESS OR IMPLIED, INCLUDING:
            </p>
            <ul>
              <li>MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE</li>
              <li>NON-INFRINGEMENT OF THIRD-PARTY RIGHTS</li>
              <li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
              <li>ACCURACY OR RELIABILITY OF RESULTS</li>
            </ul>

            <h3>10.2 Limitation of Liability</h3>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR LIABILITY IS LIMITED TO:
            </p>
            <ul>
              <li>THE AMOUNT YOU PAID FOR THE SERVICE IN THE PRECEDING 12 MONTHS</li>
              <li>DIRECT DAMAGES ONLY (NO INDIRECT, CONSEQUENTIAL, OR PUNITIVE DAMAGES)</li>
              <li>DAMAGES ARISING FROM OUR GROSS NEGLIGENCE OR WILLFUL MISCONDUCT</li>
            </ul>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold MedSpaGen harmless from any claims, damages, or expenses arising from:
            </p>
            <ul>
              <li>Your use of the service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you upload or generate using our service</li>
            </ul>

            <h2>12. Termination</h2>

            <h3>12.1 Termination by You</h3>
            <p>
              You may terminate your account at any time by canceling your subscription and 
              contacting support to delete your account.
            </p>

            <h3>12.2 Termination by Us</h3>
            <p>
              We may terminate or suspend your account immediately if you:
            </p>
            <ul>
              <li>Violate these Terms of Service</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Fail to pay subscription fees</li>
              <li>Pose a security risk to our systems</li>
            </ul>

            <h2>13. Dispute Resolution</h2>

            <h3>13.1 Governing Law</h3>
            <p>
              These Terms are governed by the laws of the State of California, without regard to 
              conflict of law principles.
            </p>

            <h3>13.2 Arbitration</h3>
            <p>
              Any disputes arising from these Terms will be resolved through binding arbitration 
              in San Francisco, California, except for:
            </p>
            <ul>
              <li>Claims for intellectual property infringement</li>
              <li>Claims seeking injunctive relief</li>
              <li>Small claims court matters under $10,000</li>
            </ul>

            <h2>14. General Provisions</h2>

            <h3>14.1 Entire Agreement</h3>
            <p>
              These Terms constitute the entire agreement between you and MedSpaGen regarding the service.
            </p>

            <h3>14.2 Severability</h3>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions 
              will remain in full force and effect.
            </p>

            <h3>14.3 No Waiver</h3>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver 
              of those rights.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul>
              <li><strong>Email:</strong> legal@medspagen.com</li>
              <li><strong>Address:</strong> MedSpaGen Inc., 741 Lakefield Road Suite G, Thousand Oaks, CA 91361</li>
              <li><strong>Phone:</strong> (323) 638-7499</li>
            </ul>

            <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-xl not-prose">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">Important Notice</h3>
                  <p className="text-amber-800">
                    These Terms of Service are legally binding. By using MedSpaGen, you acknowledge that you have read, 
                    understood, and agree to be bound by these terms. If you have questions about any provision, 
                    please contact our legal team before using the service.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;