import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, CheckCircle, Lock, Users, Eye, FileText } from 'lucide-react';

const HipaaCompliance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliance</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              HIPAA <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Compliance</span>
            </h1>
            <p className="text-lg text-gray-600">
              Understanding how MedSpaGen maintains HIPAA compliance for before & after marketing content
            </p>
          </div>

          {/* Compliance Summary */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-12">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-900 mb-4">MedSpaGen is HIPAA Compliant</h2>
                <p className="text-green-800 text-lg leading-relaxed">
                  MedSpaGen operates in full compliance with HIPAA regulations for the processing of before & after 
                  marketing content. Since these images are already publicly shared by healthcare providers for 
                  marketing purposes, they fall outside the scope of protected health information (PHI) under HIPAA guidelines.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 prose prose-lg max-w-none">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 not-prose">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Public Content</h3>
                <p className="text-sm text-gray-600">Before/after images used for marketing are already public</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <Lock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Secure Processing</h3>
                <p className="text-sm text-gray-600">Enterprise-grade security for all data handling</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Patient Consent</h3>
                <p className="text-sm text-gray-600">Proper consent already obtained for marketing use</p>
              </div>
            </div>

            <h2>Understanding HIPAA and Marketing Content</h2>

            <h3>What is HIPAA?</h3>
            <p>
              The Health Insurance Portability and Accountability Act (HIPAA) is a federal law that protects 
              patient health information. It establishes national standards for the protection of Protected Health 
              Information (PHI) and governs how healthcare providers handle sensitive medical data.
            </p>

            <h3>HIPAA and Before/After Marketing Images</h3>
            <p>
              Before and after images used in medical spa and aesthetic practice marketing occupy a unique position 
              under HIPAA regulations. These images are specifically exempted from traditional PHI protections when they are:
            </p>
            <ul>
              <li>Obtained with explicit patient consent for marketing purposes</li>
              <li>Already publicly shared on websites, social media, and marketing materials</li>
              <li>Used to demonstrate treatment outcomes and promote services</li>
              <li>Shared voluntarily by patients or with their express permission</li>
            </ul>

            <h2>Why MedSpaGen is HIPAA Compliant</h2>

            <h3>1. Pre-Authorized Public Content</h3>
            <p>
              The images processed by MedSpaGen are already in the public domain through your marketing activities. Since patients have:
            </p>
            <ul>
              <li>Provided explicit consent for marketing use</li>
              <li>Agreed to public sharing of their treatment results</li>
              <li>Authorized use across multiple marketing channels</li>
              <li>Voluntarily participated in promotional content</li>
            </ul>
            <p>
              These images do not fall under HIPAA's PHI protections, as they have been specifically authorized for public marketing purposes.
            </p>

            <h3>2. Marketing Exception Under HIPAA</h3>
            <p>
              HIPAA regulations include specific provisions for marketing materials. Under 45 CFR § 164.508, 
              when patients provide written authorization for the use of their information in marketing communications, 
              that content is no longer considered protected under standard PHI rules.
            </p>

            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl not-prose my-8">
              <div className="flex items-start space-x-3">
                <FileText className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Legal Basis</h4>
                  <p className="text-blue-800 text-sm">
                    <strong>45 CFR § 164.508(a)(3):</strong> "A covered entity may not use or disclose protected health information 
                    for marketing purposes, except if the covered entity obtains an authorization that meets the applicable requirements."
                    <br/><br/>
                    Since marketing authorizations have already been obtained for before/after content, this material is 
                    exempt from standard HIPAA protections.
                  </p>
                </div>
              </div>
            </div>

            <h3>3. No Additional PHI Creation</h3>
            <p>
              MedSpaGen's AI processing does not create, access, or generate any new protected health information. We:
            </p>
            <ul>
              <li>Process only publicly-authorized marketing images</li>
              <li>Do not access medical records or treatment information</li>
              <li>Do not collect patient identifiers beyond what's visible in marketing photos</li>
              <li>Do not store medical history or treatment details</li>
            </ul>

            <h2>Our HIPAA Compliance Measures</h2>

            <h3>Technical Safeguards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose my-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Data Encryption</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• End-to-end encryption for all data transmission</li>
                  <li>• AES-256 encryption for data at rest</li>
                  <li>• Secure HTTPS connections for all communications</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Access Controls</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Multi-factor authentication required</li>
                  <li>• Role-based access limitations</li>
                  <li>• Regular access audits and reviews</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Infrastructure Security</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SOC 2 Type II compliant hosting</li>
                  <li>• Regular security audits and assessments</li>
                  <li>• Continuous monitoring and threat detection</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Data Handling</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Secure data processing workflows</li>
                  <li>• Automated data retention policies</li>
                  <li>• Secure deletion when requested</li>
                </ul>
              </div>
            </div>

            <h3>Administrative Safeguards</h3>
            <ul>
              <li><strong>Staff Training:</strong> All employees receive HIPAA compliance training</li>
              <li><strong>Policy Enforcement:</strong> Comprehensive privacy and security policies</li>
              <li><strong>Incident Response:</strong> Established procedures for security incidents</li>
              <li><strong>Regular Audits:</strong> Ongoing compliance monitoring and assessment</li>
            </ul>

            <h3>Physical Safeguards</h3>
            <ul>
              <li><strong>Secure Facilities:</strong> Data centers with physical access controls</li>
              <li><strong>Device Controls:</strong> Secure handling of all computing devices</li>
              <li><strong>Media Controls:</strong> Secure procedures for data storage media</li>
            </ul>

            <h2>Your Responsibilities as a Healthcare Provider</h2>

            <h3>Patient Consent Requirements</h3>
            <p>
              While MedSpaGen processes publicly-authorized content, you must ensure:
            </p>
            <ul>
              <li>Proper written consent has been obtained for all before/after images</li>
              <li>Patients understand their images may be used in marketing materials</li>
              <li>Consent forms specify the scope of permitted usage</li>
              <li>Patients can withdraw consent at any time</li>
            </ul>

            <h3>Professional Standards</h3>
            <p>
              As a healthcare provider, you should:
            </p>
            <ul>
              <li>Follow medical board guidelines for advertising</li>
              <li>Ensure accuracy in before/after representations</li>
              <li>Maintain appropriate professional standards</li>
              <li>Respect patient privacy preferences</li>
            </ul>

            <h2>Business Associate Agreement (BAA)</h2>
            <p>
              For enterprise customers who prefer additional contractual protections, MedSpaGen can provide a 
              Business Associate Agreement (BAA). While not required for publicly-authorized marketing content, 
              a BAA provides extra assurance and formal documentation of our compliance commitments.
            </p>

            <div className="p-6 bg-green-50 border border-green-200 rounded-xl not-prose my-8">
              <h4 className="text-lg font-semibold text-green-900 mb-3">Enterprise BAA Available</h4>
              <p className="text-green-800 mb-4">
                Enterprise customers can request a signed Business Associate Agreement for additional peace of mind, 
                even though it's not required for marketing content processing.
              </p>
              <a 
                href="mailto:compliance@medspagen.com" 
                className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
              >
                Request BAA
              </a>
            </div>

            <h2>Compliance Monitoring and Audits</h2>

            <h3>Regular Assessments</h3>
            <p>
              MedSpaGen undergoes regular compliance assessments including:
            </p>
            <ul>
              <li>Annual HIPAA compliance audits by certified third parties</li>
              <li>SOC 2 Type II examinations for operational controls</li>
              <li>Penetration testing and security assessments</li>
              <li>Privacy impact assessments for new features</li>
            </ul>

            <h3>Incident Response</h3>
            <p>
              In the unlikely event of a security incident, we have established procedures to:
            </p>
            <ul>
              <li>Immediately contain and assess the impact</li>
              <li>Notify affected customers within 24 hours</li>
              <li>Coordinate with authorities as required</li>
              <li>Implement corrective measures to prevent recurrence</li>
            </ul>

            <h2>Industry Recognition and Certifications</h2>
            <ul>
              <li><strong>SOC 2 Type II:</strong> Annual certification for security and availability controls</li>
              <li><strong>ISO 27001:</strong> Information security management system certification</li>
              <li><strong>HITECH Compliance:</strong> Adherence to Health Information Technology Act requirements</li>
              <li><strong>Privacy Shield:</strong> Framework compliance for international data transfers</li>
            </ul>

            <h2>Contact Our Compliance Team</h2>
            <p>
              For questions about our HIPAA compliance measures or to request compliance documentation, 
              please contact our dedicated compliance team:
            </p>
            <ul>
              <li><strong>Email:</strong> compliance@medspagen.com</li>
              <li><strong>Phone:</strong> (323) 638-7499</li>
              <li><strong>Address:</strong> MedSpaGen Inc., 741 Lakefield Road Suite G, Thousand Oaks, CA 91361</li>
            </ul>

            <div className="mt-12 p-6 bg-blue-50 rounded-xl not-prose">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Questions About HIPAA Compliance?</h3>
              <p className="text-blue-800 mb-4">
                Our compliance team is available to answer questions about HIPAA requirements, provide compliance 
                documentation, or discuss how MedSpaGen fits into your practice's privacy and security framework.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:compliance@medspagen.com" 
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Contact Compliance Team
                </a>
                <a 
                  href="/documentation" 
                  className="inline-flex items-center justify-center border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 font-semibold"
                >
                  View Documentation
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HipaaCompliance;