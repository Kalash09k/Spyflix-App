import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios from 'axios';

interface CinetPayPaymentData {
    payment_url: string;
    paymentId: string;
    transaction_id?: string;
  }
interface CinetPayResponse {
    code: string;
    message: string;
    data: CinetPayPaymentData | null;
    payment_url?: string;
    transaction_id: string;
}

@Injectable()
export class PaymentsService {
  private logger = new Logger('PaymentsService');

  async initPayment(opts: {
    orderId: string;
    amount: number;
    currency?: string;
    designation?: string;
    customerPhone?: string;
  }) {
    const CINETPAY_URL = 'https://api-checkout.cinetpay.com/v2/payment';
    const body = {
      amount: opts.amount,
      currency: opts.currency || 'XAF',
      site_id: process.env.CINETPAY_SITE_ID,
      apikey: process.env.CINETPAY_API_KEY,
      designation: opts.designation || `Paiement order ${opts.orderId}`,
      customer_name: 'Client', // optionnel
      customer_surname: '',
      customer_email: '',
      customer_phone_number: opts.customerPhone || '',
      return_url: `${process.env.FRONTEND_URL}/payment/success?orderId=${opts.orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?orderId=${opts.orderId}`,
      notify_url: `${process.env.BACKEND_URL}/webhooks/cinetpay`,
      metadata: JSON.stringify({ orderId: opts.orderId }),
    };

    try {
      const resp = await axios.post<CinetPayResponse>(CINETPAY_URL, body, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      });

      const responseData = resp.data;

      // La réponse dépend de CinetPay : vérifie payment_url / data
      if (resp.data && (resp.data.data?.payment_url || resp.data.payment_url)) {
        // retourne l'URL de paiement et l'id transaction si fourni
        const paymentUrl = resp.data.data?.payment_url || resp.data.payment_url;
        if (paymentUrl) {
            const paymentId = responseData.data?.transaction_id || responseData.transaction_id || null;
            return { paymentUrl, paymentId, raw: responseData };
          }
      }

      this.logger.error('Init payment: réponse inattendue', resp.data);
      throw new BadRequestException('Impossible d\'initialiser le paiement');
    } catch (err: any) {
      this.logger.error('Erreur initPayment', err?.response?.data || err.message);
      throw new BadRequestException('Erreur init paiement');
    }
  }
}
