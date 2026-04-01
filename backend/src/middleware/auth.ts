import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Role } from '@prisma/client';

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'your_access_secret';

interface JwtPayload {
  userId: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const protect = (roles?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
      req.user = decoded;

      if (roles && roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next();
    } catch (error: any) {
      if (error.name !== 'TokenExpiredError') {
        console.error('Auth Error:', error);
      }
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
  };
};
