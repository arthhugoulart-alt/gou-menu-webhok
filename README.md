# GOU Menu - Webhook Vercel

## Deploy na Vercel

### 1. Subir para GitHub
Suba esta pasta `vercel-webhook` para um repositório no GitHub.

### 2. Conectar na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Import Project → Selecione o repositório
3. Deploy

### 3. Configurar Variáveis de Ambiente

No painel da Vercel, vá em **Settings → Environment Variables** e adicione:

| Nome | Valor | Obrigatório |
|------|-------|-------------|
| `MP_ACCESS_TOKEN` | Seu token do Mercado Pago | ✅ SIM |
| `KV_REST_API_URL` | URL do Vercel KV | ⚠️ Opcional* |
| `KV_REST_API_TOKEN` | Token do Vercel KV | ⚠️ Opcional* |

> **\*Nota sobre Vercel KV:** Para persistência dos dados, você precisa criar um Vercel KV store:
> 1. No painel Vercel → Storage → Create Database → KV
> 2. Conecte ao seu projeto
> 3. As variáveis serão configuradas automaticamente

### 4. Configurar Webhook no Mercado Pago

1. Acesse [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Suas integrações → Webhooks
3. URL: `https://SEU-PROJETO.vercel.app/webhook`
4. Eventos: `payment`

---

## Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| `POST` | `/webhook` | Recebe Mercado Pago |
| `GET` | `/check/USERNAME` | Verifica se é premium |
| `GET` | `/list` | Lista todos premium |
| `GET` | `/health` | Status |

---

## Estrutura

```
vercel-webhook/
├── api/
│   ├── _lib/
│   │   └── database.ts    # Banco de dados (Vercel KV)
│   ├── webhook.ts         # POST /webhook
│   ├── check.ts           # GET /check/:username
│   ├── list.ts            # GET /list
│   └── health.ts          # GET /health
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md
```

---

## Atualizar C++ (Gui.cpp)

Após o deploy, pegue a URL do seu projeto e atualize em `Gui.cpp`:

```cpp
static const std::string PREMIUM_API_URL = "https://seu-projeto.vercel.app";
```

---

## Variáveis de Ambiente Necessárias

### Obrigatória:
- **MP_ACCESS_TOKEN** - Token do Mercado Pago
  - Onde encontrar: [Mercado Pago Developers](https://www.mercadopago.com.br/developers) → Suas credenciais → Access Token

### Opcionais (para persistência):
- **KV_REST_API_URL** - Gerado automaticamente ao criar Vercel KV
- **KV_REST_API_TOKEN** - Gerado automaticamente ao criar Vercel KV

> ⚠️ Sem Vercel KV, os dados ficam apenas em memória e serão perdidos quando a função "dormir" (após ~15 min de inatividade)
