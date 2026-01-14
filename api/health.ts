/**
 * Health Endpoint - Status do servidor
 * GET /health ou GET /
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllPremiumUsers } from './_lib/database';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        const users = await getAllPremiumUsers();

        return res.status(200).json({
            status: 'ok',
            service: 'GOU Menu Premium API',
            premiumUsers: users.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return res.status(200).json({
            status: 'ok',
            service: 'GOU Menu Premium API',
            timestamp: new Date().toISOString(),
        });
    }
}
