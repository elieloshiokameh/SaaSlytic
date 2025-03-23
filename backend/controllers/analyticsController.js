const User = require('../models/User');

exports.getMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mock metrics data for MVP
    const metrics = {
      mrr: {
        current: 5000,
        growth: 15,
        history: [
          { month: 'Jan', value: 4000 },
          { month: 'Feb', value: 4500 },
          { month: 'Mar', value: 5000 }
        ]
      },
      churn: {
        rate: 2.5,
        history: [
          { month: 'Jan', value: 3.2 },
          { month: 'Feb', value: 2.8 },
          { month: 'Mar', value: 2.5 }
        ]
      },
      ltv: {
        current: 1200,
        history: [
          { month: 'Jan', value: 1000 },
          { month: 'Feb', value: 1100 },
          { month: 'Mar', value: 1200 }
        ]
      },
      customers: {
        total: 150,
        active: 145,
        new: 10,
        churned: 5
      }
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metrics', error: error.message });
  }
};

exports.getPredictions = async (req, res) => {
  try {
    // Mock predictions data for MVP
    const predictions = {
      mrr: {
        nextMonth: 5750,
        nextQuarter: 6500,
        confidence: 85
      },
      churn: {
        predictedRate: 2.2,
        atRiskCustomers: 5,
        confidence: 78
      },
      growth: {
        predictedGrowth: 18,
        confidence: 82
      }
    };

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching predictions', error: error.message });
  }
}; 