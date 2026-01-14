/**
 * Webhook Endpoint - Recebe notificações do Mercado Pago
 * POST /webhook
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { addPremiumUser } from './_lib/database';

// Token do Mercado Pago (configurar via variável de ambiente)
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || '';

interface MercadoPagoWebhook {
    id: number;
    type: string;
    action: string;
    data: {
        id: string;
    };
}

interface PaymentData {
    id: number;
    status: string;
    external_reference?: string;
    transaction_amount: number;
    description: string;
}

/**
 * Busca detalhes do pagamento na API do Mercado Pago
 */
async function getPaymentDetails(paymentId: string): Promise<PaymentData | null> {
    try {
        const response = await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
            }
        );
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body: MercadoPagoWebhook = req.body;

        console.log(`📨 Webhook: ${body.type} - ${body.action}`);

        if (body.type === 'payment') {
            const payment = await getPaymentDetails(body.data.id);

            if (!payment) {
                console.log('❌ Pagamento não encontrado');
                return res.status(200).json({ message: 'OK' });
            }

            console.log(`   Status: ${payment.status}`);

            if (payment.status === 'approved') {
                const username = payment.external_reference;

                if (!username) {
                    console.log('❌ Pagamento sem username (external_reference)');
                    return res.status(200).json({ message: 'OK' });
                }

                // Registrar usuário como premium
                await addPremiumUser({
                    username: username,
                    activatedAt: new Date().toISOString(),
                    paymentId: String(payment.id),
                    amount: payment.transaction_amount,
                });

                console.log(`✅ Usuário ${username} agora é PREMIUM!`);
                console.log(`   Valor: R$ ${payment.transaction_amount}`);
            }
        }

        return res.status(200).json({ message: 'OK' });
    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({ error: 'Internal error' });
    }
}
