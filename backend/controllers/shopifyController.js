const axios = require('axios');

const authenticateShop = async (req, res) => {
  const { shop } = req.query;
  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_orders,read_products&redirect_uri=${process.env.REDIRECT_URI}`;
  res.redirect(authUrl);
};

const getShopifyData = async (req, res) => {
  const { shop, accessToken } = req.query;

  try {
    const response = await axios.get(`https://${shop}/admin/api/2023-01/orders.json`, {
      headers: { 'X-Shopify-Access-Token': accessToken }
    });

    res.json({ orders: response.data.orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Shopify data' });
  }
};

module.exports = { authenticateShop, getShopifyData };
