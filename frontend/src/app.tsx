import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Subscriptions from "./pages/Subscriptions";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

const token = "TON_JWT_ICI"; // remplacer par token réel après login

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Subscriptions token={token} />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
      </Routes>
    </Router>
  );
};

export default App;
