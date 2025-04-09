import { CreditCard, LayoutDashboard, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickAccessItem {
  title: string;
  description: string;
  icon: string;
  path: string;
}

export const QuickAccessSection = () => {
  const quickAccessItems = [
    {
      title: "Dashboard",
      description: "Overview of your trading strategies",
      icon: "dashboard",
      path: "/dashboard"
    },
    {
      title: "Settings",
      description: "Manage your account settings",
      icon: "settings",
      path: "/settings"
    },
    {
      title: "Billing",
      description: "Manage your subscription and billing details",
      icon: "creditCard",
      path: "/billing"
    },
    {
      title: "Broker Details",
      description: "View all broker configuration details",
      icon: "database", // You can change this to an appropriate icon
      path: "/broker-details"
    },
  ];

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case "dashboard":
        return <LayoutDashboard className="w-5 h-5" />;
      case "settings":
        return <Settings className="w-5 h-5" />;
      case "creditCard":
        return <CreditCard className="w-5 h-5" />;
      case "database":
        return <CreditCard className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickAccessItems.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-700"
          >
            <div className="flex items-center mb-2">
              {getIconComponent(item.icon)}
              <h3 className="ml-2 font-medium">{item.title}</h3>
            </div>
            <p className="text-sm text-gray-400">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
