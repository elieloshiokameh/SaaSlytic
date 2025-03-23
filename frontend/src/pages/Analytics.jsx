import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Historical Data',
    },
  },
};

function Analytics() {
  const [metrics, setMetrics] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsResponse, predictionsResponse] = await Promise.all([
          axios.get('/api/analytics/metrics'),
          axios.get('/api/analytics/predictions')
        ]);
        setMetrics(metricsResponse.data);
        setPredictions(predictionsResponse.data);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const ltvData = {
    labels: metrics.ltv.history.map(item => item.month),
    datasets: [
      {
        label: 'LTV',
        data: metrics.ltv.history.map(item => item.value),
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>

      {/* Predictions Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Predictions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Next Month MRR
              </Typography>
              <Typography variant="h4">${predictions.mrr.nextMonth}</Typography>
              <Typography
                color={predictions.mrr.confidence >= 80 ? 'success.main' : 'warning.main'}
                variant="body2"
              >
                {predictions.mrr.confidence}% confidence
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Predicted Churn Rate
              </Typography>
              <Typography variant="h4">{predictions.churn.predictedRate}%</Typography>
              <Typography
                color={predictions.churn.confidence >= 80 ? 'success.main' : 'warning.main'}
                variant="body2"
              >
                {predictions.churn.confidence}% confidence
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {predictions.churn.atRiskCustomers} customers at risk
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Growth Prediction
              </Typography>
              <Typography variant="h4">{predictions.growth.predictedGrowth}%</Typography>
              <Typography
                color={predictions.growth.confidence >= 80 ? 'success.main' : 'warning.main'}
                variant="body2"
              >
                {predictions.growth.confidence}% confidence
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Historical Data Section */}
      <Typography variant="h5" gutterBottom>
        Historical Data
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Line options={options} data={ltvData} />
          </Paper>
        </Grid>
      </Grid>

      {/* Customer Metrics */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Customer Acquisition
            </Typography>
            <Typography variant="h4">{metrics.customers.new}</Typography>
            <Typography variant="body2" color="text.secondary">
              New customers this month
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Customer Churn
            </Typography>
            <Typography variant="h4">{metrics.customers.churned}</Typography>
            <Typography variant="body2" color="text.secondary">
              Churned customers this month
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Analytics; 