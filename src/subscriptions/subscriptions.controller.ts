import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // Créer un groupe
  @Post('create')
  async create(@Body() body: {
    ownerId: string;
    serviceName: string;
    plan: string;
    pricePerSlot: number;
    totalSlots: number;
  }) {
    return this.subscriptionsService.createGroup(body);
  }

  // Recherche par service
  @Get('search')
  async search(@Query('service') service: string) {
    return this.subscriptionsService.searchGroups(service);
  }

  // Détail d'un groupe
  @Get(':id')
  async getGroup(@Param('id') id: string) {
    return this.subscriptionsService.getGroupById(id);
  }
}
