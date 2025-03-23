import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
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
      text: 'Monthly Metrics',
    },
  },
};

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/api/analytics/metrics');
        setMetrics(response.data);
      } catch (err) {
        setError('Failed to fetch metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
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

  const mrrData = {
    labels: metrics.mrr.history.map(item => item.month),
    datasets: [
      {
        label: 'MRR',
        data: metrics.mrr.history.map(item => item.value),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const churnData = {
    labels: metrics.churn.history.map(item => item.month),
    datasets: [
      {
        label: 'Churn Rate (%)',
        data: metrics.churn.history.map(item => item.value),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              MRR
            </Typography>
            <Typography variant="h4">${metrics.mrr.current}</Typography>
            <Typography
              color={metrics.mrr.growth >= 0 ? 'success.main' : 'error.main'}
              variant="body2"
            >
              {metrics.mrr.growth >= 0 ? '+' : ''}{metrics.mrr.growth}% from last month
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Churn Rate
            </Typography>
            <Typography variant="h4">{metrics.churn.rate}%</Typography>
            <Typography variant="body2" color="text.secondary">
              Monthly churn rate
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              LTV
            </Typography>
            <Typography variant="h4">${metrics.ltv.current}</Typography>
            <Typography variant="body2" color="text.secondary">
              Customer lifetime value
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Customers
            </Typography>
            <Typography variant="h4">{metrics.customers.active}</Typography>
            <Typography variant="body2" color="text.secondary">
              Out of {metrics.customers.total} total
            </Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Line options={options} data={mrrData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Line options={options} data={churnData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 