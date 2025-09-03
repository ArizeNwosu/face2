import { stripePromise, STRIPE_PRICE_IDS, PLAN_DETAILS } from '../lib/stripe';
import { updateUserSubscription } from './authService';
import type { UserProfile } from '../store/authStore';

export const createCheckoutSession = async (
  planId: 'starter' | 'pro' | 'enterprise',
  userId: string,
  userEmail: string
) => {
  try {
    const API_URL = import.meta.env.DEV 
      ? 'http://localhost:3001/api' 
      : '/api';

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

    const { sessionId, url } = await response.json();
    
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// For demo purposes - simulate successful payment
export const simulatePayment = async (
  planId: 'starter' | 'pro' | 'enterprise',
  userId: string
): Promise<boolean> => {
  try {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would be handled by Stripe webhooks
    const planDetails = PLAN_DETAILS[planId];
    
    const subscription: UserProfile['subscription'] = {
      plan: planId,
      status: 'active',
      videosRemaining: planDetails.videos,
      videosTotal: planDetails.videos,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    };

    await updateUserSubscription(userId, subscription);
    return true;
  } catch (error) {
    console.error('Error simulating payment:', error);
    return false;
  }
};

export const createCustomerPortalSession = async (customerId: string) => {
  try {
    const API_URL = import.meta.env.DEV 
      ? 'http://localhost:3001/api' 
      : '/api';

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
      : '/api';

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