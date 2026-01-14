/**
 * Check Endpoint - Verifica se usuário é premium
 * GET /check/:username
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isPremiumUser } from './_lib/database';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Pegar username da query (/check?username=xxx)
    const username = req.query.username as string;

    if (!username) {
        return res.status(400).json({ error: 'Username required' });
    }

    try {
        const user = await isPremiumUser(username);

        const result = {
            username: username,
            isPremium: !!user,
            activatedAt: user?.activatedAt || null,
        };

        console.log(`🔍 Check: ${username} -> ${result.isPremium ? 'PREMIUM' : 'FREE'}`);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({ error: 'Internal error' });
    }
}
