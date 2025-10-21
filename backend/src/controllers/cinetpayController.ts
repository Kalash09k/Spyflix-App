import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { initiateCinetPayTransaction } from "../services/cinetpayService.ts";

const prisma = new PrismaClient();

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.body;
    const userId = (req as any).userId;

    const subscription = await prisma.subscription.findUnique({
      where: { id: Number(subscriptionId) },
      include: { owner: true },
    });
    if (!subscription) return res.status(404).json({ message: "Abonnement introuvable" });

    const transactionId = `sub-${subscriptionId}-${Date.now()}`;

    const result = await initiateCinetPayTransaction(
      subscription.price,
      subscription.currency || "XAF",
      `Paiement ${subscription.service_name} - ${subscription.plan_name}`,
      transactionId,
      `${process.env.BACKEND_URL}/api/payments/cinetpay-webhook`,
      `${process.env.FRONTEND_URL}/payment/success`,
      userId.toString(),
      subscription.id.toString()
    );

    await prisma.payment.create({
      data: { subscriptionUserId: 0, amount: subscription.price, status: "pending", stripePaymentId: transactionId },
    });

    res.json({ payment_url: result.data.payment_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur création paiement CinetPay" });
  }
};

export const cinetpayWebhook = async (req: Request, res: Response) => {
  try {
    const { transaction_id, status, metadata } = req.body;

    const userId = Number(metadata?.userId);
    const subscriptionId = Number(metadata?.subscriptionId);
    if (!userId || !subscriptionId) return res.status(400).json({ message: "userId ou subscriptionId manquant" });

    const payment = await prisma.payment.findFirst({ where: { stripePaymentId: transaction_id } });
    if (!payment) return res.status(404).json({ message: "Aucun paiement trouvé" });

    if (status === "ACCEPTED") {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "paid" } });

      const existing = await prisma.subscriptionUser.findFirst({ where: { subscriptionId, userId } });
      if (!existing) {
        const subUser = await prisma.subscriptionUser.create({ data: { subscriptionId, userId, role: "member" } });
        await prisma.payment.update({ where: { id: payment.id }, data: { subscriptionUserId: subUser.id } });
        await prisma.subscription.update({ where: { id: subscriptionId }, data: { current_users: { increment: 1 } } });
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur webhook CinetPay" });
  }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { transaction_id } = req.body;

    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: transaction_id },
    });

    if (!payment) {
      return res.status(404).json({ message: "Paiement non trouvé" });
    }

    res.json({ status: payment.status });
  } catch (err) {
    console.error("Erreur vérification paiement:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
