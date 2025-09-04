import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, Check, Crown, Zap, Users, LogOut, Clock, Download, Eye, Calendar } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { logout, updateUserSubscription } from '../services/authService';
import { createCheckoutSession, createCustomerPortalSession } from '../services/stripeService';
import { videoService } from '../services/videoService';

interface VideoHistory {
  id: string;
  title: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  downloadUrl?: string;
  thumbnailUrl?: string;
}

const Dashboard = () => {
  const { user, userProfile, logout: logoutStore, getTotalCredits } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [videoHistory, setVideoHistory] = useState<VideoHistory[]>([]);
  const navigate = useNavigate();

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 49,
      videos: 5,
      icon: Zap,
      description: 'Perfect for small practices just getting started',
      features: [
        '5 videos per month',
        '720P quality output',
        'Email support',
        'Processed in 60 seconds'
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 99,
      videos: 20,
      icon: Crown,
      description: 'Ideal for growing MedSpas and aesthetic clinics',
      features: [
        '20 videos per month',
        '1080P quality output',
        'Priority support',
        'Processed in 60 seconds'
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      videos: 50,
      icon: Crown,
      description: 'For large practices with high-volume needs',
      features: [
        '50 videos',
        '1080P quality output',
        'Dedicated support',
        'Processed in 60 seconds'
      ],
      popular: false,
    },
  ];

  const hasActiveSubscription = userProfile?.subscription.status === 'active' && 
                                userProfile?.subscription.plan !== 'free' &&
                                userProfile?.subscription.stripeCustomerId;

  // Fetch real video history from Firestore
  useEffect(() => {
    const fetchVideoHistory = async () => {
      if (user) {
        try {
          const videos = await videoService.getUserVideos(user.uid);
          const formattedVideos = videos.map(video => videoService.formatVideoForDisplay(video));
          setVideoHistory(formattedVideos);
        } catch (error) {
          console.error('Error fetching video history:', error);
          // Fall back to empty array on error
          setVideoHistory([]);
        }
      }
    };

    fetchVideoHistory();
  }, [user]);

  const refreshVideoHistory = async () => {
    if (user) {
      try {
        const videos = await videoService.getUserVideos(user.uid);
        const formattedVideos = videos.map(video => videoService.formatVideoForDisplay(video));
        setVideoHistory(formattedVideos);
      } catch (error) {
        console.error('Error refreshing video history:', error);
      }
    }
  };

  const handleViewHistory = () => {
    // Refresh history when opening modal
    refreshVideoHistory();
    setShowHistory(true);
  };

  const handlePlanSelection = async (planId: string) => {
    if (!user || !userProfile) return;
    
    setLoading(true);
    setSelectedPlan(planId);

    try {
      console.log('Starting payment for plan:', planId);
      console.log('User ID:', user.uid);
      console.log('User email:', user.email);
      
      await createCheckoutSession(
        planId as 'starter' | 'pro' | 'enterprise',
        user.uid,
        user.email || ''
      );
      // The createCheckoutSession function handles the redirect internally
    } catch (error) {
      console.error('Error processing payment:', error);
      console.error('Error details:', error.message);
      alert(`Payment failed: ${error.message}. Please try again.`);
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!userProfile?.subscription.stripeCustomerId) {
      alert('You need an active subscription to manage billing. Please select a plan first.');
      return;
    }

    try {
      await createCustomerPortalSession(userProfile.subscription.stripeCustomerId);
      // User will be redirected to Stripe Customer Portal
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Unable to open subscription management. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      logoutStore();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img 
                src="/logo.png" 
                alt="MedSpaGen Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900">MedSpaGen</span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Welcome, {userProfile?.displayName || user?.displayName || 'User'}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {hasActiveSubscription ? 'Your Dashboard' : 'Choose Your Plan'}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            {hasActiveSubscription 
              ? 'Welcome back! You can start generating videos or manage your subscription.'
              : 'Select a plan to start generating amazing before & after videos for your MedSpa. Every new user gets 3 free video credits to start, plus the credits included in your chosen plan.'
            }
          </p>
        </div>

        {hasActiveSubscription ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Current Subscription</h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 bg-blue-50 rounded-xl gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 capitalize">
                      {userProfile?.subscription.plan} Plan
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base text-gray-600">
                        {userProfile?.subscription.videosRemaining} of {userProfile?.subscription.videosTotal} plan videos remaining
                      </p>
                      {userProfile?.credits && (
                        <div className="flex items-center space-x-3 text-xs sm:text-sm">
                          {userProfile.credits.free > 0 && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {userProfile.credits.free} Free Credits
                            </span>
                          )}
                          {userProfile.credits.bonus > 0 && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                              {userProfile.credits.bonus} Bonus Credits
                            </span>
                          )}
                          <span className="text-gray-500 font-medium">
                            Total: {getTotalCredits()} credits available
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Link
                      to="/generate"
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm sm:text-base"
                    >
                      Start Creating
                    </Link>
                    {userProfile?.subscription.stripeCustomerId && (
                      <button
                        onClick={handleManageSubscription}
                        className="border border-blue-600 text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
                      >
                        Manage Subscription
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
              <div className="space-y-3 sm:space-y-4">
                <Link
                  to="/generate"
                  className="w-full flex items-center space-x-3 p-3 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Generate Video</span>
                </Link>
                <button 
                  onClick={handleViewHistory}
                  className="w-full flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="font-medium text-gray-900 text-sm sm:text-base">View History</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative p-4 sm:p-6 lg:p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105' 
                      : 'bg-white text-gray-900 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6 sm:mb-8">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 ${
                      plan.popular ? 'bg-white/20' : 'bg-gradient-to-r from-blue-100 to-purple-100'
                    }`}>
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${plan.popular ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-3 sm:mb-4">
                      <span className="text-2xl sm:text-4xl font-bold">${plan.price}</span>
                      <span className={`text-sm sm:text-lg ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                        /month
                      </span>
                    </div>
                    <p className={`text-sm sm:text-base ${plan.popular ? 'text-blue-100' : 'text-gray-600'} px-2`}>
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2 sm:space-x-3">
                        <Check className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 ${plan.popular ? 'text-green-300' : 'text-green-500'} flex-shrink-0`} />
                        <span className={`text-sm sm:text-base ${plan.popular ? 'text-blue-50' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanSelection(plan.id)}
                    disabled={loading && selectedPlan === plan.id}
                    className={`w-full py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                      plan.popular
                        ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading && selectedPlan === plan.id ? 'Processing...' : 'Get Started'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!hasActiveSubscription && (
          <div className="mt-8 sm:mt-12 text-center px-4">
            <p className="text-gray-600 mb-4 text-sm sm:text-base">All plans include 24/7 support • No setup fees • Cancel anytime</p>
            <div className="flex flex-col sm:flex-row sm:justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>SSL Security</span>
              </span>
              <span className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>HIPAA Compliant</span>
              </span>
              <span className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>100% Secure Payment</span>
              </span>
            </div>
          </div>
        )}

        {userProfile?.subscription.plan === 'free' && (
          <div className="mt-8 sm:mt-12 text-center px-4">
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Free Plan Active
              </h3>
              <div className="space-y-3 mb-4">
                <p className="text-sm sm:text-base text-gray-600">
                  Plan: {userProfile.subscription.videosRemaining} free videos remaining
                </p>
                {userProfile.credits && (
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
                    {userProfile.credits.free > 0 && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        {userProfile.credits.free} Free Credits
                      </span>
                    )}
                    {userProfile.credits.bonus > 0 && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                        {userProfile.credits.bonus} Bonus Credits
                      </span>
                    )}
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      Total: {getTotalCredits()} credits available
                    </span>
                  </div>
                )}
                <p className="text-sm sm:text-base text-gray-600">
                  Upgrade to unlock more features and generate unlimited videos.
                </p>
              </div>
              {getTotalCredits() > 0 && (
                <Link
                  to="/generate"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span>Try Free Videos</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Video History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Video History</h3>
                </div>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {videoHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No videos yet</h4>
                  <p className="text-gray-600 mb-4">Start creating your first before & after video!</p>
                  <Link
                    to="/generate"
                    onClick={() => setShowHistory(false)}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    <span>Generate Video</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoHistory.map((video) => (
                    <div key={video.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {video.status === 'completed' && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                Completed
                              </span>
                            )}
                            {video.status === 'processing' && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                Processing
                              </span>
                            )}
                            {video.status === 'failed' && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                Failed
                              </span>
                            )}
                          </div>
                          
                          {video.status === 'completed' && video.downloadUrl && (
                            <div className="flex space-x-2">
                              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {videoHistory.length} video{videoHistory.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;