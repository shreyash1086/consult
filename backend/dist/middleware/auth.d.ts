import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
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
export declare const protect: (roles?: Role[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
