import React, { useState } from "react";
import axios from "axios";

type Props = {
  subscriptionId: number;
  token: string; // JWT
};

const PaymentButton: React.FC<Props> = ({ subscriptionId, token }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments/create-payment`,
        { subscriptionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Rediriger vers CinetPay
      window.location.href = res.data.payment_url;
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'initiation du paiement. Veuillez reessayer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      {loading ? "Chargement..." : "Payer avec Orange/MTN"}
    </button>
  );
};

export default PaymentButton;
