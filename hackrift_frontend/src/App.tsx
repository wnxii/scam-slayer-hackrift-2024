import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PhoneNumbersPage from "./pages/PhoneNumbersPage";
import FraudDetectorPage from "./pages/FraudDetectorPage";
import UsersPage from "./pages/UsersPage";
import UserPage from "./pages/UserPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Routes>
          {/* Define route for the login page */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/phoneNumbers" element={<PhoneNumbersPage />} />
          <Route path="/fraudDetector" element={<FraudDetectorPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:companyName" element={<UserPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
