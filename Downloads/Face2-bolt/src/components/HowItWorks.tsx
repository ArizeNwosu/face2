import React from 'react';
import { Upload, Brain, Video, Download } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Photos',
      description: 'Securely upload patient before and after photos through our platform.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Brain,
      title: 'AI Processing',
      description: 'Our advanced AI analyzes the be before and after image for video translarion.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Video,
      title: 'Video Generation',
      description: 'Our AI then generates a stunning before & after video with cinematic effects.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Download,
      title: 'Download & Share',
      description: 'Download your professional video and share across all marketing channels.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional before & after videos in just 4 easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full transform -translate-x-1/2 translate-x-8">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-blue-600">60s</div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Average Processing Time</div>
              <div className="text-sm text-gray-600">From upload to finished video</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;