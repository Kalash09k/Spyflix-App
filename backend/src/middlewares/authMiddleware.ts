import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthenticatedRequest extends Request {
    userId?: number;
}

export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token manquant ou invalide' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || !parts[1]) {
        return res.status(401).json({ message: 'Token malformé' });
    }

    const token = parts[1].trim(); // TypeScript sait maintenant que c'est un string

    try {
        const payload: any = jwt.verify(token, JWT_SECRET);
        (req as any).userId = payload.userId;
        next();
        
        const decoded = jwt.verify(token, JWT_SECRET) as unknown;

        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
            req.userId = (decoded as { userId: number }).userId;
            next();
        } else {
            return res.status(401).json({ message: 'Token invalide' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Token invalide' });
    }

};
