// src/utils/pagination.ts
import { Request } from 'express';

export function parsePaging(req: Request) {
  const limit  = Math.min(parseInt(req.query.limit as string)  || 20, 100);
  const offset = Math.max(parseInt(req.query.offset as string) || 0,  0);
  return { limit, offset };
}
