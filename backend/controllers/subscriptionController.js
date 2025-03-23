const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');
const User = require('../models/User');

exports.createSubscription = async (req, res) => {
  try {
    const { priceId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create or retrieve Stripe customer
    let customerId = user.subscription.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: userId
        }
      });
      customerId = customer.id;
      user.subscription.stripeCustomerId = customerId;
      await user.save();
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });
    if (!subscription) {
      // Create a free subscription if none exists
      const newSubscription = await Subscription.create({
        userId: req.user.id,
        plan: 'free',
        status: 'active'
      });
      return res.json(newSubscription);
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription' });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!['free', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    // Find or create subscription
    let subscription = await Subscription.findOne({ userId: req.user.id });
    
    if (!subscription) {
      // Create new subscription if none exists
      subscription = await Subscription.create({
        userId: req.user.id,
        plan,
        status: 'active'
      });
    } else {
      // Update existing subscription
      subscription.plan = plan;
      subscription.status = 'active';
      subscription.startDate = new Date();
      await subscription.save();
    }

    // Update user's subscription plan
    const user = await User.findById(req.user.id);
    if (user) {
      user.subscription = {
        plan,
        status: 'active',
        startDate: subscription.startDate
      };
      await user.save();
    }

    res.json(subscription);
  } catch (error) {
    console.error('Subscription update error:', error);
    res.status(500).json({ message: 'Error updating subscription' });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    subscription.status = 'cancelled';
    subscription.endDate = new Date();
    await subscription.save();

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling subscription' });
  }
}; 