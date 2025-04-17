
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutDialog from "@/components/LogoutDialog";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // When the Logout page is accessed directly, redirect to home and handle logout there
    navigate('/', { replace: true, state: { showLogout: true } });
  }, [navigate]);

  return null; // This page won't render any UI now since it will redirect
};

export default Logout;
