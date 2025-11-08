// Flutterwave configuration service - Hardcoded for now
export const getFlutterwaveConfig = () => {
  // Hardcoded configuration - update these values when going live
  const isLive = false; // Change to true when ready for live mode
  const publicKey = 'FLWPUBK_TEST-207369ac04111bbe3b0a7e0e30a9beb8-X'; // Your test key
  
  return {
    publicKey: publicKey,
    isLive: isLive,
    environment: isLive ? 'live' : 'test',
    baseUrl: isLive ? 'https://api.flutterwave.com/v3' : 'https://api.flutterwave.com/v3'
  };
};

// Generate unique transaction reference
export const generateTransactionRef = (planName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `UNILAG-${planName.toUpperCase()}-${timestamp}-${random}`;
};

// Validate payment response
export const validatePaymentResponse = (response) => {
  if (!response) {
    throw new Error('No payment response received');
  }

  if (response.status === 'successful') {
    return {
      success: true,
      transactionId: response.transaction_id,
      flwRef: response.flw_ref,
      txRef: response.tx_ref,
      amount: response.amount,
      currency: response.currency,
      customer: response.customer
    };
  } else {
    return {
      success: false,
      error: response.message || 'Payment failed',
      status: response.status
    };
  }
};