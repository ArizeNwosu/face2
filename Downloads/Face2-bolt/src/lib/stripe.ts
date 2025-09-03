import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const STRIPE_PRICE_IDS = {
  starter: 'price_1S2yL5Av3wDYpeRLWQaKy4Mi', // Replace with your actual Stripe price ID
  pro: 'price_1S2yLnAv3wDYpeRLUOrLkw4y',         // Replace with your actual Stripe price ID
  enterprise: 'price_1S2yMFAv3wDYpeRLfRLmGnC6' // Replace with your actual Stripe price ID
};

export const PLAN_DETAILS = {
  starter: {
    videos: 5,
    name: 'Starter',
    price: 49,
  },
  pro: {
    videos: 20,
    name: 'Professional',
    price: 99,
  },
  enterprise: {
    videos: 50,
    name: 'Enterprise',
    price: 199,
  }
};