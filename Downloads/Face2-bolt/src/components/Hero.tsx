import React from 'react';
import { Play, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="pt-24 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
         
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Turn <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Before & After</span>
             &nbsp;Photos into Engaging Videos
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Generate scroll-stopping content for MedSpas using before & after images.

          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleGetStarted}
              className="group bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Start Creating Videos</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default Hero;