/**
 * Banco de dados em memória + Vercel KV
 * Usuários premium são armazenados no Vercel KV para persistência
 */

import { kv } from '@vercel/kv';

export interface PremiumUser {
    username: string;
    activatedAt: string;
    paymentId: string;
    amount: number;
}

const KV_KEY = 'premium_users';

// Fallback para memória (caso KV não esteja configurado)
const memoryStore: Map<string, PremiumUser> = new Map();
let kvAvailable = true;

/**
 * Adiciona usuário premium
 */
export async function addPremiumUser(user: PremiumUser): Promise<void> {
    const key = user.username.toLowerCase();

    if (kvAvailable) {
        try {
            // Buscar dados existentes
            const existing = await kv.get<Record<string, PremiumUser>>(KV_KEY) || {};
            existing[key] = user;
            await kv.set(KV_KEY, existing);
            console.log(`[KV] Saved premium user: ${key}`);
        } catch (error) {
            console.log('[KV] Not available, using memory store');
            kvAvailable = false;
            memoryStore.set(key, user);
        }
    } else {
        memoryStore.set(key, user);
    }
}

/**
 * Verifica se usuário é premium
 */
export async function isPremiumUser(username: string): Promise<PremiumUser | null> {
    const key = username.toLowerCase();

    if (kvAvailable) {
        try {
            const data = await kv.get<Record<string, PremiumUser>>(KV_KEY);
            return data?.[key] || null;
        } catch (error) {
            kvAvailable = false;
            return memoryStore.get(key) || null;
        }
    }

    return memoryStore.get(key) || null;
}

/**
 * Lista todos os usuários premium
 */
export async function getAllPremiumUsers(): Promise<PremiumUser[]> {
    if (kvAvailable) {
        try {
            const data = await kv.get<Record<string, PremiumUser>>(KV_KEY);
            return data ? Object.values(data) : [];
        } catch (error) {
            kvAvailable = false;
            return Array.from(memoryStore.values());
        }
    }

    return Array.from(memoryStore.values());
}
