import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Créer un abonnement
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { service_name, plan_name, price, currency, max_users, description } = req.body;
    const ownerId = (req as any).userId;

    const subscription = await prisma.subscription.create({
      data: {
        ownerId,
        service_name,
        plan_name,
        price: Number(price),
        currency: currency || 'xaf',
        max_users: Number(max_users),
        description,
      },
    });

    res.json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Lister tous les abonnements
export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: { owner: true, users: true },
    });
    res.json(subscriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un abonnement par ID
export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await prisma.subscription.findUnique({
      where: { id: Number(id) },
      include: { owner: true, users: true },
    });
    if (!subscription) return res.status(404).json({ message: 'Aucun abonnement trouvé' });
    res.json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Rejoindre un abonnement
export const joinSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // subscriptionId
    const userId = (req as any).userId;

    const subscription = await prisma.subscription.findUnique({ where: { id: Number(id) } });
    if (!subscription) return res.status(404).json({ message: 'Aucun abonnement trouvé' });

    // Vérifier si déjà membre
    const existing = await prisma.subscriptionUser.findFirst({
      where: { subscriptionId: subscription.id, userId },
    });
    if (existing) return res.status(400).json({ message: 'Vous êtes déjà membre' });

    // Vérifier max_users
    if (subscription.current_users >= subscription.max_users)
      return res.status(400).json({ message: 'Abonnement complet' });

    // Ajouter l’utilisateur à SubscriptionUser
    await prisma.subscriptionUser.create({
      data: { subscriptionId: subscription.id, userId, role: 'member' },
    });

    // Incrémenter current_users
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { current_users: { increment: 1 } },
    });

    res.json({ message: 'Rejoint avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
