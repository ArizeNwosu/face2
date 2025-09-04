import { PLAN_DETAILS } from '../lib/stripe';
import { updateUserSubscription } from './authService';
import type { UserProfile } from '../store/authStore';

// Real Stripe integration - updated to use live checkout

export const createCheckoutSession = async (
  planId: 'starter' | 'pro' | 'enterprise',
  userId: string,
  userEmail: string
) => {
  try {
    const API_URL = import.meta.env.DEV 
      ? 'http://localhost:3001/api' 
      : 'https://server-aba65ueoo-myaddressmails-projects.vercel.app/api';

    const response = await fetch(`${API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        userId,
        userEmail,
        successUrl: `${window.location.origin}/dashboard?success=true&plan=${planId}`,
        cancelUrl: `${window.location.origin}/dashboard?canceled=true`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    
    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    alert('Sorry, there was an error starting the checkout process. Please try again.');
    throw error;
  }
};


export const createCustomerPortalSession = async (customerId: string) => {
  try {
    const API_URL = import.meta.env.DEV 
      ? 'http://localhost:3001/api' 
      : 'https://server-aba65ueoo-myaddressmails-projects.vercel.app/api';

    const response = await fetch(`${API_URL}/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/dashboard`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create portal session');
    }

    const { url } = await response.json();
    
    // Redirect to Stripe Customer Portal
    window.location.href = url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string, userId: string) => {
  try {
    const API_URL = import.meta.env.DEV 
      ? 'http://localhost:3001/api' 
      : 'https://server-aba65ueoo-myaddressmails-projects.vercel.app/api';

    const response = await fetch(`${API_URL}/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to cancel subscription');
    }

    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};