import React, { useState } from 'react';
import QRCodeGenerator from './QRCodeGenerator';
import './static/PaymentForm.css'; // Import your custom CSS

const PaymentForm = ({ open, onClose, onConfirm }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);

  const handleConfirm = () => {
    if (validateForm()) {
      const paymentData = {
        customerName,
        customerEmail,
        paymentAmount: parseFloat(paymentAmount),
      };
      onConfirm(paymentData); // Pass the payment data back to the parent component
      setCustomerName('');
      setCustomerEmail('');
      setPaymentAmount(0);
    } else {
      alert('Please enter valid information!');
    }
  };

  const validateForm = () => {
    return (
      customerName.trim() !== '' &&
      customerEmail.trim() !== '' &&
      parseFloat(paymentAmount) > 0
    );
  };

  return (
    <div className={`dialog-wrapper ${open ? 'open' : ''}`}>
      <div className="dialog">
        <h2>Payment Options</h2>
        <div className="qr-code">
          {/* The "Pay using ETH" button is removed */}
          <QRCodeGenerator data={`QR code data for business - Amount: ${paymentAmount}`} size={200} />
        </div>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="Payment Amount ($)"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
        <div className="buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;








