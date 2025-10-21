import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SubscriptionsService {
  // Créer un groupe d'abonnement
  async createGroup(data: {
    ownerId: string;
    serviceName: string;
    plan: string;
    pricePerSlot: number;
    totalSlots: number;
  }) {

    const ownerIdAsNumber = parseInt(data.ownerId, 10);

    if (isNaN(ownerIdAsNumber)) {
      // Gérer l'erreur, par exemple, jeter une exception
      throw new Error("L'identifiant du propriétaire (ownerId) n'est pas un nombre valide.");
  }

    const group = await prisma.subscriptionGroup.create({
      data: {
        ownerId: ownerIdAsNumber,
        serviceName: data.serviceName,
        plan: data.plan,
        pricePerSlot: data.pricePerSlot,
        totalSlots: data.totalSlots,
        availableSlots: data.totalSlots,
      },
    });
    return group;
  }

  // Récupérer tous les groupes disponibles pour un service
  async searchGroups(serviceName: string) {
    const groups = await prisma.subscriptionGroup.findMany({
      where: {
        serviceName: {
          contains: serviceName,
          mode: 'insensitive',
        },
        availableSlots: { gt: 0 },
      },
      include: {
        owner: true, // On peut afficher infos du propriétaire si nécessaire
      },
    });
    return groups;
  }

  // Récupérer un groupe par ID
  async getGroupById(id: string) {
    return prisma.subscriptionGroup.findUnique({
      where: { id },
      include: { owner: true },
    });
  }
}
