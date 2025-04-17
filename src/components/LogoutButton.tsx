
import { Button, ButtonProps } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps extends ButtonProps {
  showIcon?: boolean;
}

const LogoutButton = ({ 
  children = "Logout", 
  showIcon = true, 
  variant = "logout",
  className,
  ...props 
}: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/', { state: { showLogout: true } });
  };
  
  return (
    <Button 
      onClick={handleLogout} 
      variant={variant} 
      className={className}
      {...props}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {children}
    </Button>
  );
};

export default LogoutButton;
