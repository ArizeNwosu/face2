import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, Check, Crown, Zap, Users, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { logout } from '../services/authService';
import { createCheckoutSession, createCustomerPortalSession } from '../services/stripeService';

const Dashboard = () => {
  const { user, userProfile, logout: logoutStore } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handlePlanSelection = async (planId: string) => {
    if (!user || !userProfile) return;
    
    setLoading(true);
    setSelectedPlan(planId);

    try {
      await createCheckoutSession(
        planId as 'starter' | 'pro' | 'enterprise',
        user.uid,
        user.email || ''
      );
      // User will be redirected to Stripe Checkout
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!userProfile?.subscription.stripeCustomerId) {
      alert('No customer ID found. Please contact support.');
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

  const hasActiveSubscription = userProfile?.subscription.status === 'active' && 
                                userProfile?.subscription.plan !== 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">MedSpaGen</span>
            </div>
            
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
              : 'Select a plan to start generating amazing before & after videos for your MedSpa.'
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
                    <p className="text-sm sm:text-base text-gray-600">
                      {userProfile?.subscription.videosRemaining} of {userProfile?.subscription.videosTotal} videos remaining
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Link
                      to="/generate"
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm sm:text-base"
                    >
                      Start Creating
                    </Link>
                    <button
                      onClick={handleManageSubscription}
                      className="border border-blue-600 text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
                    >
                      Manage Subscription
                    </button>
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
                <button className="w-full flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
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
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                You have {userProfile.subscription.videosRemaining} free videos remaining.
                Upgrade to unlock more features and generate unlimited videos.
              </p>
              {userProfile.subscription.videosRemaining > 0 && (
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
    </div>
  );
};

export default Dashboard;