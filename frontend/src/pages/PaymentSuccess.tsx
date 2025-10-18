import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

interface PaymentCheckResponse {
  status: "paid" | "pending" | "failed";
  [key: string]: any; // optional, if the backend sends extra fields
}

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Vérification en cours...");

  useEffect(() => {
    const sessionId = searchParams.get("transaction_id"); // ou la query utilisée par CinetPay

    if (sessionId) {
      // Appeler le backend pour vérifier le paiement
      axios
        .post<PaymentCheckResponse>(`${import.meta.env.VITE_API_URL}/api/payments/check`, { transaction_id: sessionId })
        .then((res) => {
          if (res.data.status === "paid") {
            setStatus("✅ Paiement réussi ! Vous êtes maintenant membre de l'abonnement.");
          } else {
            setStatus("❌ Paiement non confirmé. Veuillez patienter.");
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus("❌ Erreur lors de la vérification du paiement");
        });
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-2xl font-bold mb-4">Paiement Mobile Money</h1>
      <p className="text-lg">{status}</p>
    </div>
  );
};

export default PaymentSuccess;
