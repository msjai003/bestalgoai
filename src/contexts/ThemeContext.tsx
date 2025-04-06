
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('dark_mode');
    if (savedTheme === null) {
      // Auto-set dark mode after 6pm if not manually set
      const hour = new Date().getHours();
      setIsDarkMode(hour >= 18 || hour < 6);
    } else {
      setIsDarkMode(savedTheme === 'true');
    }
  }, []);
  
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('dark_mode', String(newMode));
      return newMode;
    });
  };
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
