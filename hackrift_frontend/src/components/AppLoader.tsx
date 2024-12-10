import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/Spinner"; // Import Spinner component

interface AppLoaderProps {
  children: React.ReactNode;
}

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 3 seconds
    }, 1500);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size={48} className="text-gray-600" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AppLoader;
