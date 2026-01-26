"use server"

import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { OrderEmailTemplate, OrderItem } from '@/components/emails/OrderEmailTemplate';
import React from 'react';

export async function sendOrderConfirmation(orderData: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
}) {
  console.log("Starting email send process for order:", orderData.orderId);

  // 1. Validate Env Vars
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error("EMAIL_USER or EMAIL_PASS is missing in .env");
    return { success: false, error: "Email configuration missing" };
  }

  // 2. Create Transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use STARTTLS
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // 3. Verify Connection
    await transporter.verify();
    console.log("Transporter verified successfully");

    // 4. Render HTML
    const emailHtml = await render(
      React.createElement(OrderEmailTemplate, {
        orderId: orderData.orderId,
        customerName: orderData.customerName,
        items: orderData.items,
        total: orderData.total,
      })
    );

    // 5. Send Mail
    const mailOptions = {
      from: `"AniRent Orders" <${user}>`,
      to: orderData.customerEmail,
      subject: `Order Confirmation - ${orderData.orderId}`,
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully! Message ID:", info.messageId);
    
    return { success: true };
  } catch (error) {
    const err = error as { code?: string; message: string; response?: string };
    console.error("Full Nodemailer Error Log:");
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
    if (err.response) console.error("SMTP Response:", err.response);
    
    return { success: false, error: err.message };
  }
}
