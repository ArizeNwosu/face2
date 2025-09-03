import React from 'react';
import { Zap, Shield, Clock, Sparkles, Users, BarChart3 } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast AI',
      description: 'Generate professional before & after videos in under 60 seconds using our advanced AI algorithms.'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'By repurposing already public consented images, the generated videos will be HIPAA compliant'
    },
    {
      icon: Clock,
      title: 'Save Hours of Work',
      description: 'Eliminate manual video editing. Our AI handles everything from photo analysis to final output.'
    },
    {
      icon: Sparkles,
      title: 'Professional Quality',
      description: 'Cinema-grade transitions, effects, and animations that showcase results beautifully.'
    },
    {
      icon: Users,
      title: 'Patient Engagement',
      description: 'Increase consultation bookings with compelling visual content that patients love to share.'
    },
    {
      icon: BarChart3,
      title: 'Social Media Growth',
      description: 'Grow your brand on social media by posting engaging videos generated from before & after images.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Content Generation Made Easy
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful AI technology designed specifically for MedSpas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;