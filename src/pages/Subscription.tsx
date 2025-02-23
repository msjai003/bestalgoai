
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    price: "₹999",
    period: "/mo",
    features: [
      "5 Trading Strategies",
      "Basic Analytics",
      "Email Support"
    ],
    isPopular: false
  },
  {
    name: "Elite",
    price: "₹4,999",
    period: "/mo",
    features: [
      "Unlimited Strategies",
      "Advanced Analytics",
      "24/7 Priority Support",
      "Custom Indicators"
    ],
    isPopular: true
  }
];

const Subscription = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/settings" className="p-2">
            <i className="fa-solid fa-arrow-left text-gray-400"></i>
          </Link>
          <h1 className="text-lg font-semibold">Subscription & Billing</h1>
          <button className="p-2">
            <i className="fa-solid fa-gear text-gray-400"></i>
          </button>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <section className="mb-8">
          <div className="bg-gradient-to-br from-[#FF00D4]/10 to-purple-900/20 rounded-2xl p-6 border border-[#FF00D4]/20 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-[#FF00D4] font-bold text-xl">Pro Plan</h2>
                <p className="text-gray-400 text-sm">Valid until Mar 15, 2025</p>
              </div>
              <span className="bg-[#FF00D4]/20 text-[#FF00D4] px-3 py-1 rounded-full text-sm">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold">₹2,999<span className="text-sm text-gray-400">/month</span></p>
              <Button 
                className="bg-[#FF00D4] text-white shadow-lg shadow-[#FF00D4]/20 hover:bg-[#FF00D4]/90"
              >
                Upgrade Plan
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
          <div className="space-y-4">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={cn(
                  "rounded-xl p-4 border",
                  plan.isPopular 
                    ? "bg-gradient-to-br from-[#FF00D4]/5 to-purple-900/10 border-[#FF00D4]/20" 
                    : "bg-gray-800/50 border-gray-700"
                )}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className={cn(
                    "font-bold",
                    plan.isPopular ? "text-[#FF00D4]" : ""
                  )}>{plan.name}</h3>
                  <p className="text-lg font-bold">
                    {plan.price}<span className="text-sm text-gray-400">{plan.period}</span>
                  </p>
                </div>
                <ul className="text-sm text-gray-400 space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <i className={cn(
                        "fa-solid fa-check mr-2",
                        plan.isPopular ? "text-[#FF00D4]" : "text-green-400"
                      )}></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={cn(
                    "w-full",
                    plan.isPopular 
                      ? "bg-[#FF00D4] text-white shadow-lg shadow-[#FF00D4]/20 hover:bg-[#FF00D4]/90" 
                      : "border border-[#FF00D4] text-[#FF00D4] bg-transparent hover:bg-[#FF00D4]/10"
                  )}
                >
                  Select Plan
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <i className="fa-regular fa-credit-card text-gray-400 mr-3"></i>
                <div>
                  <p className="font-medium">•••• 4242</p>
                  <p className="text-sm text-gray-400">Expires 08/25</p>
                </div>
              </div>
              <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded-full text-xs">Default</span>
            </div>
            <Button 
              variant="outline"
              className="w-full border-gray-700 text-gray-400 hover:bg-gray-700/50"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Add Payment Method
            </Button>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default Subscription;
