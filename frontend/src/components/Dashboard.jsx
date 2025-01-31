import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/shopify/sales-data?shop=your-shop.myshopify.com&accessToken=your-access-token')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <h1>Sales Dashboard</h1>
      {data ? (
        <ul>
          {data.orders.map(order => (
            <li key={order.id}>Order #{order.id} - ${order.total_price}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;