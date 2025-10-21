import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'OWNER' | 'BUYER';
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: data.role,
      },
    });
    return user;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Utilisateur non trouvé');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Mot de passe incorrect');

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    return { user, token };
  }
}
