import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      'Basic metrics',
      'Up to 100 customers',
      'Monthly reports',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '$49/month',
    features: [
      'Advanced metrics',
      'Up to 1000 customers',
      'Weekly reports',
      'Priority support',
      'Predictive analytics',
      'API access',
    ],
  },
  {
    name: 'Enterprise',
    price: '$199/month',
    features: [
      'All Pro features',
      'Unlimited customers',
      'Daily reports',
      '24/7 support',
      'Custom integrations',
      'Dedicated account manager',
    ],
  },
];

function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subscription, setSubscription] = useState(user?.subscription || null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await axios.get('/api/subscriptions');
        setSubscription(response.data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };

    fetchSubscription();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('/api/users/profile', {
        companyName,
        email
      });
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionChange = async (plan) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('/api/subscriptions', { plan: plan.toLowerCase() });
      setSuccess('Subscription updated successfully');
      // Refresh subscription data
      const response = await axios.get('/api/subscriptions');
      setSubscription(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.delete('/api/subscriptions');
      // Automatically switch to free plan after cancellation
      await axios.put('/api/subscriptions', { plan: 'free' });
      setSuccess('Subscription cancelled successfully and switched to free plan');
      // Refresh subscription data
      const response = await axios.get('/api/subscriptions');
      setSubscription(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Profile Settings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Profile Settings
        </Typography>
        <form onSubmit={handleUpdateProfile}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Subscription Settings */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Subscription
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.name}>
              <Paper
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: subscription?.plan === plan.name.toLowerCase() ? '2px solid #1976d2' : 'none',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" gutterBottom>
                  {plan.price}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {plan.features.map((feature) => (
                      <li key={feature} style={{ marginBottom: '8px' }}>
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </Box>
                {subscription?.plan !== plan.name.toLowerCase() && (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleSubscriptionChange(plan.name)}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Switch to ' + plan.name}
                  </Button>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        {subscription?.plan !== 'free' && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelSubscription}
              disabled={loading}
            >
              Cancel Subscription
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleSubscriptionChange('Free')}
              disabled={loading}
            >
              Switch to Free Plan
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Settings; 