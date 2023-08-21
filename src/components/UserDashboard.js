import React, { useState, useEffect } from 'react';
import { mdiLogout } from '@mdi/js';
import Icon from '@mdi/react';
import QRCodeGenerator from './QRCodeGenerator';
import Web3 from 'web3';
import PaymentContractABI from './PaymentContractABI.json';
import PaymentForm from './PaymentForm';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '0px',
    position: 'relative',
    background: '#b3e0ff',
    minHeight: '110vh',
    color: 'black',
  },
  logoutButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  welcomeMessage: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: '20px',
  },
  paymentButton: {
    marginBottom: '10px',
  },
  successMessage: {
    color: 'green',
    marginTop: '10px',
  },
  customButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};

const handleLogout = () => {
  alert('Logout successful');
  window.location.href = '/';
};

const BusinessUserDashboard = ({ user }) => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePayNow = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePayment = (amount) => {
    setQrCodeData(`QR code data for business - Amount: ${amount}`);
    setIsModalOpen(false);
  };


  return (
    <div style={styles.dashboardContainer}>
      <button
        onClick={handleLogout}
        style={styles.logoutButton}
      >
        <Icon path={mdiLogout} size={1} color="red" />
      </button>
      <h2 style={styles.title}>Business User Dashboard</h2>
      <p style={styles.welcomeMessage}>
        Welcome, {user.name} <span role="img" aria-label="Waving Hand">👋</span>
      </p>
      <div style={styles.actionContainer}>
        <p>This is the dashboard for business users.</p>
        <button
          style={styles.customButton}
          onClick={handlePayNow}
        >
          Pay Now
        </button>
        {qrCodeData && <QRCodeGenerator data={qrCodeData} size={200} />}
        <PaymentForm open={isModalOpen} onClose={handleCloseModal} onConfirm={handlePayment} />
      </div>
    </div>
  );
};


const CustomerUserDashboard = ({ user, qrCodeData, onUpdateQRCode }) => {
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [generatedQRCodeData, setGeneratedQRCodeData] = useState('');

  const handlePayUsingEth = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const contractAddress = '0xE7fF5D7227f4Eb5b7E261c961892bE00dB0A2D99';
      const paymentContract = new web3.eth.Contract(PaymentContractABI, contractAddress);

      // Send the payment to the smart contract
      await paymentContract.methods.pay().send({
        from: accounts[0],
        value: web3.utils.toWei('100', 'ether'), // Replace '100' with the actual payment amount
      });

      // Update the QR code data with the new payment information
      const qrCodeData = `QR code data for customer - Amount: 100`; // Replace '100' with the actual payment amount
      setGeneratedQRCodeData(qrCodeData);
      onUpdateQRCode(qrCodeData);

      // Show the payment success message
      setPaymentSuccessful(true);

      // You may want to update other states or perform additional actions after successful payment
      // For example, update user data, etc.
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  useEffect(() => {
    if (paymentSuccessful) {
      const timer = setTimeout(() => {
        setPaymentSuccessful(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccessful]);

  return (
    <div style={styles.dashboardContainer}>
      <button
        onClick={handleLogout}
        style={styles.logoutButton}
      >
        <Icon path={mdiLogout} size={1} color="black" />
      </button>
      <h2 style={styles.title}>Customer User Dashboard</h2>
      <p style={styles.welcomeMessage}>
        Welcome, {user.name} <span role="img" aria-label="Waving Hand">👋</span>
      </p>
      <div style={styles.actionContainer}>
        <p>This is the dashboard for customer users.</p>
        <button
          style={styles.customButton}
          onClick={handlePayUsingEth}
        >
          Pay using ETH
        </button>
        {qrCodeData && <QRCodeGenerator data={generatedQRCodeData || qrCodeData} size={200} />}
        {paymentSuccessful && <p style={styles.successMessage}>Payment successful!</p>}
      </div>
    </div>
  );
};

const UserDashboard = ({ user }) => {
  const [qrCodeData, setQrCodeData] = useState('');

  const onUpdateQRCode = (data) => {
    setQrCodeData(data);
  };

  return (
    <div>
      {user.userType === 'business' ? (
        <BusinessUserDashboard user={user} qrCodeData={qrCodeData} onUpdateQRCode={onUpdateQRCode} />
      ) : (
        <CustomerUserDashboard user={user} qrCodeData={qrCodeData} onUpdateQRCode={onUpdateQRCode} />
      )}
    </div>
  );
};

export default UserDashboard;
export { BusinessUserDashboard, CustomerUserDashboard };