import { useState, useCallback } from 'react';
import { getFlutterwaveConfig, validatePaymentResponse } from '../Services/flutterwaveService';

export const useFlutterwave = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const launchFlutterwave = useCallback(async (options) => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      const config = getFlutterwaveConfig();
      
      // Enhanced options with production settings
      const enhancedOptions = {
        ...options,
        public_key: config.publicKey,
        meta: {
          ...options.meta,
          environment: config.environment,
          app_version: '1.0.0',
          timestamp: new Date().toISOString()
        },
        callback: function(response) {
          console.log('Flutterwave Callback Fired:', response);
          setIsLoading(false);
          try {
            const validatedResponse = validatePaymentResponse(response);
            resolve(validatedResponse);
          } catch (error) {
            reject(error);
          }
        },
        onclose: function() {
          console.log('Flutterwave Modal Closed');
          setIsLoading(false);
          reject(new Error('Payment was cancelled by user'));
        },
      };

      if (window.FlutterwaveCheckout) {
        executePayment(enhancedOptions);
      } else {
        loadFlutterwaveScript(enhancedOptions);
      }

      function loadFlutterwaveScript(options) {
        const script = document.createElement('script');
        script.src = 'https://checkout.flutterwave.com/v3.js';
        script.async = true;
        
        script.onload = () => {
          console.log('Flutterwave script loaded');
          executePayment(options);
        };
        script.onerror = () => {
          console.error('Failed to load Flutterwave script');
          setIsLoading(false);
          reject(new Error('Failed to load Flutterwave payment gateway'));
        };
        
        document.body.appendChild(script);
      }

      function executePayment(options) {
        console.log('Executing Flutterwave payment...');
        window.FlutterwaveCheckout(options);
      }
    });
  }, []);

  return { 
    launchFlutterwave, 
    isLoading, 
    error,
    clearError: () => setError(null)
  };
};