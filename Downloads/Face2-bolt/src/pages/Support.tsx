import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HelpCircle, MessageSquare, Mail, Phone, Clock, Search, Book, Users, ExternalLink } from 'lucide-react';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I create my first video?',
      answer: 'After signing up, navigate to the Generate page, upload your before and after photos, customize your animation settings, and click Generate Video. The AI will process your images and create a professional video in 30-60 seconds.'
    },
    {
      category: 'technical',
      question: 'What image formats are supported?',
      answer: 'We support JPG, PNG, WEBP, and GIF formats. Images should be under 10MB each and at least 720px on the smallest side for best results.'
    },
    {
      category: 'billing',
      question: 'How does the pricing work?',
      answer: 'We offer three plans: Starter ($49/month for 50 videos), Pro ($149/month for 200 videos), and Enterprise ($399/month for unlimited videos). All plans include access to all features and high-quality downloads.'
    },
    {
      category: 'technical',
      question: 'Why is my video generation taking so long?',
      answer: 'Video generation typically takes 30-60 seconds. Delays can occur due to high demand, large file sizes, or complex animations. If generation takes over 5 minutes, please refresh and try again.'
    },
    {
      category: 'getting-started',
      question: 'What makes a good before/after photo pair?',
      answer: 'Use consistent lighting, camera angles, and poses between photos. Ensure the subject is clearly visible and the treatment area is in focus. Avoid heavily filtered or edited images for best AI processing results.'
    },
    {
      category: 'billing',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your account dashboard. You\'ll retain access to all features until the end of your current billing period.'
    },
    {
      category: 'technical',
      question: 'Can I use the videos commercially?',
      answer: 'Yes, all videos generated are yours to use commercially. This includes social media marketing, website content, presentations, and any other business purposes.'
    },
    {
      category: 'compliance',
      question: 'Is MedSpaGen HIPAA compliant?',
      answer: 'Yes, MedSpaGen is HIPAA compliant for before/after content that is already publicly shared. Since these images are typically used in marketing materials and social media, they fall outside traditional HIPAA protections.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              <span>Help Center</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              How can we <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">help you?</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers to common questions, get technical support, and learn how to make the most of MedSpaGen.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, or topics..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Help Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Documentation</h3>
              <p className="text-gray-600 mb-6">
                Complete guides, tutorials, and API documentation to help you get the most out of MedSpaGen.
              </p>
              <a 
                href="/documentation" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
              >
                View Docs <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Chat</h3>
              <p className="text-gray-600 mb-6">
                Get instant help from our support team. Available Monday-Friday, 9 AM to 6 PM PST.
              </p>
              <button className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold">
                Start Chat <MessageSquare className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600 mb-6">
                Join our community forum to connect with other users, share tips, and get peer support.
              </p>
              <a 
                href="https://community.medspagen.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold"
              >
                Join Forum <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Direct Support?</h2>
              <p className="text-gray-600">Our team is here to help with any questions or technical issues.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-3">Get detailed help via email</p>
                <a href="mailto:support@medspagen.com" className="text-blue-600 hover:text-blue-800 font-semibold">
                  support@medspagen.com
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-3">Enterprise customers only</p>
                <a href="tel:+13236387499" className="text-green-600 hover:text-green-800 font-semibold">
                  (323) 638-7499
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Support Hours</h3>
                <p className="text-gray-600 mb-1">Monday - Friday</p>
                <p className="text-amber-600 font-semibold">9:00 AM - 6:00 PM PST</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory('getting-started')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'getting-started'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Getting Started
                </button>
                <button
                  onClick={() => setSelectedCategory('technical')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'technical'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Technical
                </button>
                <button
                  onClick={() => setSelectedCategory('billing')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'billing'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Billing
                </button>
                <button
                  onClick={() => setSelectedCategory('compliance')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'compliance'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Compliance
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <details key={index} className="border border-gray-200 rounded-lg">
                  <summary className="p-6 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 pr-8">{faq.question}</h3>
                    <div className="w-6 h-6 text-gray-400">
                      <svg className="w-6 h-6 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse all categories.</p>
              </div>
            )}
          </div>

          {/* Emergency Support */}
          <div className="mt-16 bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-900 mb-4">Critical Issue?</h2>
            <p className="text-red-800 mb-6">
              If you're experiencing a service outage or critical technical issue that affects your business operations, 
              please contact our emergency support line.
            </p>
            <a 
              href="mailto:emergency@medspagen.com" 
              className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold"
            >
              Emergency Contact <Mail className="w-4 h-4 ml-2" />
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;