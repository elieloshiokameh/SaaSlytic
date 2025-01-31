const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendReportEmail = async (req, res) => {
  const { email, reportData } = req.body;

  const message = {
    to: email,
    from: 'your-email@example.com',
    subject: 'Your Shopify Sales Report',
    text: `Total Revenue: ${reportData.totalRevenue}\nOrders: ${reportData.totalOrders}`,
    html: `<h1>Sales Report</h1><p>Total Revenue: ${reportData.totalRevenue}</p><p>Orders: ${reportData.totalOrders}</p>`,
  };

  try {
    await sgMail.send(message);
    res.json({ message: 'Report sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = { sendReportEmail };
