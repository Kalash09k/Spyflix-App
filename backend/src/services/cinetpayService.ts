import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const CINETPAY_BASE_URL = "https://api-checkout.cinetpay.com/v2/payment";

export const initiateCinetPayTransaction = async (
  amount: number,
  currency: string,
  description: string,
  transactionId: string,
  notifyUrl: string,
  returnUrl: string,
  customerName: string,
  subscriptionId: string
) => {
  const payload = {
    apikey: process.env.CINETPAY_API_KEY,
    site_id: process.env.CINETPAY_SITE_ID,
    transaction_id: transactionId,
    amount,
    currency,
    description,
    notify_url: notifyUrl,
    return_url: returnUrl,
    customer_name: customerName,
    channels: "MOBILE_MONEY",
    metadata: {
      userId: customerName, // ici on stocke le userId
      subscriptionId,       // et subscriptionId
    },
  };

  const response = await axios.post(`${CINETPAY_BASE_URL}/initiate`, payload);
  return response.data;
};
