import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(
        @Body() body: { name: string; email: string; phone: string; password: string; role: 'OWNER' | 'BUYER' },
    ) {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        return this.authService.login(body.email, body.password);
    }

    @Post('kyc')
    async uploadKYC(@Body() body: { userId: string; documentUrl: string }) {
        const userIdAsNumber = parseInt(body.userId, 10);
        if (isNaN(userIdAsNumber)) {
            // Dans un vrai projet NestJS, vous utiliseriez une exception HTTP (ex: NotFoundException)
            throw new Error('Invalid user ID format'); 
        }
        // stocker document dans AWS S3 ou local
        return prisma.user.update({
            where: { id: userIdAsNumber },
            data: { kycStatus: 'PENDING' },
        });
    }

}
