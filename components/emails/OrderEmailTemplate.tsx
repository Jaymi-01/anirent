import * as React from 'react';

export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

interface OrderEmailTemplateProps {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
}

export const OrderEmailTemplate: React.FC<Readonly<OrderEmailTemplateProps>> = ({
  orderId,
  customerName,
  items,
  total,
}) => (
  <div style={{
    backgroundColor: '#1E1B4B',
    color: '#FFFFFF',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px'
  }}>
    <h1 style={{ color: '#8B5CF6' }}>AniRent Order Confirmation</h1>
    <p>Hi {customerName},</p>
    <p>Your rental order has been placed successfully! Our team will contact you shortly to finalize the payment and delivery.</p>
    
    <div style={{ backgroundColor: '#2D1B69', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
      <h2 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>Order ID: {orderId}</h2>
      <hr style={{ borderColor: '#581C87' }} />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, index) => (
          <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #581C87' }}>
            {item.title} x {item.quantity} - <strong>${(item.price * item.quantity).toFixed(2)}</strong>
          </li>
        ))}
      </ul>
      <h3 style={{ textAlign: 'right', color: '#FBBF24' }}>Total: ${total.toFixed(2)}</h3>
    </div>

    <p style={{ fontSize: '12px', color: '#E9D5FF' }}>
      Thank you for choosing AniRent - The Future of Anime Rentals.
    </p>
  </div>
);