/**
 * Banco de dados usando Supabase (PostgreSQL)
 */

// Configurações Supabase (via variáveis de ambiente)
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export interface PremiumUser {
    username: string;
    activated_at: string;
    payment_id: string;
    amount: number;
}

/**
 * Helper para fazer requests ao Supabase
 */
async function supabaseRequest(
    endpoint: string,
    method: string = 'GET',
    body?: object
): Promise<any> {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;

    const headers: Record<string, string> = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
    };

    const options: RequestInit = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.text();
        console.error(`Supabase error: ${response.status} - ${error}`);
        return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

/**
 * Adiciona usuário premium
 */
export async function addPremiumUser(user: PremiumUser): Promise<boolean> {
    try {
        // Primeiro verifica se já existe
        const existing = await isPremiumUser(user.username);

        if (existing) {
            // Atualiza
            const result = await supabaseRequest(
                `premium_users?username=eq.${user.username.toLowerCase()}`,
                'PATCH',
                {
                    activated_at: user.activated_at,
                    payment_id: user.payment_id,
                    amount: user.amount,
                }
            );
            console.log(`[Supabase] Updated premium user: ${user.username}`);
            return true;
        } else {
            // Insere novo
            const result = await supabaseRequest(
                'premium_users',
                'POST',
                {
                    username: user.username.toLowerCase(),
                    activated_at: user.activated_at,
                    payment_id: user.payment_id,
                    amount: user.amount,
                }
            );
            console.log(`[Supabase] Added premium user: ${user.username}`);
            return true;
        }
    } catch (error) {
        console.error('[Supabase] Error adding user:', error);
        return false;
    }
}

/**
 * Verifica se usuário é premium
 */
export async function isPremiumUser(username: string): Promise<PremiumUser | null> {
    try {
        const result = await supabaseRequest(
            `premium_users?username=eq.${username.toLowerCase()}&select=*`
        );

        if (result && result.length > 0) {
            return result[0];
        }
        return null;
    } catch (error) {
        console.error('[Supabase] Error checking user:', error);
        return null;
    }
}

/**
 * Lista todos os usuários premium
 */
export async function getAllPremiumUsers(): Promise<PremiumUser[]> {
    try {
        const result = await supabaseRequest('premium_users?select=*');
        return result || [];
    } catch (error) {
        console.error('[Supabase] Error listing users:', error);
        return [];
    }
}
