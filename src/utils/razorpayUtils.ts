
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
  onError: (error?: any) => void
) => {
  console.log("Initializing Razorpay payment with options:", options);
  
  // Set a timeout to handle case where script fails to load or initialize
  const timeoutId = setTimeout(() => {
    console.error('Razorpay script load timed out');
    onError(new Error('Payment initialization timed out'));
  }, 15000); // 15 seconds timeout for better reliability
  
  if (!(window as any).Razorpay) {
    console.log("Loading Razorpay script");
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
      clearTimeout(timeoutId);
      createRazorpayInstance(options, onSuccess, onError);
    };
    script.onerror = (error) => {
      clearTimeout(timeoutId);
      console.error('Razorpay SDK failed to load:', error);
      onError(new Error('Failed to load payment processor'));
    };
    document.body.appendChild(script);
  } else {
    console.log("Razorpay script already loaded");
    clearTimeout(timeoutId);
    createRazorpayInstance(options, onSuccess, onError);
  }
};

// Create Razorpay instance and open payment modal
const createRazorpayInstance = (
  options: RazorpayOptions, 
  onSuccess: (payment_id: string, order_id?: string, signature?: string) => void,
  onError: (error?: any) => void
) => {
  try {
    console.log("Creating Razorpay instance with options:", options);
    
    // Validate required fields
    if (!options.key) {
      throw new Error("Razorpay key is required");
    }
    if (!options.amount || options.amount <= 0) {
      throw new Error("Valid payment amount is required");
    }
    
    // Make sure the handler is not overridden
    const finalOptions = {
      ...options,
      handler: function (response: any) {
        console.log("Payment successful:", response);
        try {
          if (response.razorpay_payment_id) {
            onSuccess(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
          } else {
            throw new Error("Payment ID not received");
          }
        } catch (error) {
          console.error("Error in payment success handler:", error);
          onError(error);
        }
      },
    };
    
    if (!(window as any).Razorpay) {
      throw new Error("Razorpay SDK not loaded");
    }
    
    const rzp = new (window as any).Razorpay(finalOptions);
    
    rzp.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      onError(response.error);
    });
    
    console.log("Opening Razorpay payment modal");
    rzp.open();
  } catch (error) {
    console.error('Error creating Razorpay instance:', error);
    onError(error);
  }
};

// Helper to convert price string to amount in paise (smallest currency unit)
export const convertPriceToAmount = (priceString: string): number => {
  console.log("Converting price string to amount:", priceString);
  // Remove currency symbol and commas, then parse as float
  const numericPrice = parseFloat(priceString.replace(/[^\d.]/g, ''));
  console.log("Numeric price:", numericPrice);
  
  if (isNaN(numericPrice) || numericPrice <= 0) {
    console.error("Invalid price:", priceString);
    throw new Error("Invalid price format");
  }
  
  // Convert to paise (multiply by 100)
  const amountInPaise = Math.round(numericPrice * 100);
  console.log("Amount in paise:", amountInPaise);
  return amountInPaise;
};
