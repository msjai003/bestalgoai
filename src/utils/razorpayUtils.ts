// Type definition for Razorpay options
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  handler?: (response: any) => void;
}

// Initialize Razorpay payment
export const initializeRazorpayPayment = (
  options: RazorpayOptions, 
  onSuccess: (payment_id: string, order_id?: string, signature?: string) => void,
  onError: () => void
) => {
  // Set a timeout to handle case where script fails to load or initialize
  const timeoutId = setTimeout(() => {
    console.error('Razorpay script load timed out');
    onError();
  }, 15000); // 15 seconds timeout for better reliability
  
  if (!(window as any).Razorpay) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      clearTimeout(timeoutId);
      createRazorpayInstance(options, onSuccess, onError);
    };
    script.onerror = () => {
      clearTimeout(timeoutId);
      console.error('Razorpay SDK failed to load');
      onError();
    };
    document.body.appendChild(script);
  } else {
    clearTimeout(timeoutId);
    createRazorpayInstance(options, onSuccess, onError);
  }
};

// Create Razorpay instance and open payment modal
const createRazorpayInstance = (
  options: RazorpayOptions, 
  onSuccess: (payment_id: string, order_id?: string, signature?: string) => void,
  onError: () => void
) => {
  try {
    const rzp = new (window as any).Razorpay({
      ...options,
      handler: function (response: any) {
        onSuccess(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature
        );
      },
    });
    
    rzp.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      onError();
    });
    
    rzp.open();
  } catch (error) {
    console.error('Error creating Razorpay instance:', error);
    onError();
  }
};

// Helper to convert price string to amount in paise (smallest currency unit)
export const convertPriceToAmount = (priceString: string): number => {
  // Remove currency symbol and commas, then parse as float
  const numericPrice = parseFloat(priceString.replace(/[^\d.]/g, ''));
  // Convert to paise (multiply by 100)
  return Math.round(numericPrice * 100);
};
