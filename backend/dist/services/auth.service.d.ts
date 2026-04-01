import { Request, Response } from 'express';
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const refresh: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const logout: (req: Request, res: Response) => void;
export declare const getMe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
