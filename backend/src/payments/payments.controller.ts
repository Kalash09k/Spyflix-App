import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('init')
  async init(@Body() body: { orderId: string; amount: number; customerPhone?: string }) {
    return this.paymentsService.initPayment({
      orderId: body.orderId,
      amount: body.amount,
      customerPhone: body.customerPhone,
    });
  }
}
