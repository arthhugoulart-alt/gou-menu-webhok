/**
 * List Endpoint - Lista todos os usuários premium
 * GET /list
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllPremiumUsers } from './_lib/database';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const users = await getAllPremiumUsers();

        return res.status(200).json({
            count: users.length,
            users: users,
        });
    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({ error: 'Internal error' });
    }
}
