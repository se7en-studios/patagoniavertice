This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Variables de entorno opcionales

Todas son opcionales: si faltan, la funcionalidad correspondiente simplemente no se activa.

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_GA_ID` | ID de medición de Google Analytics 4 (`G-XXXXXXX`). Activa gtag y los eventos de `src/lib/analytics.ts`. |
| `RESEND_API_KEY` | API key de Resend. Con `LEAD_NOTIFY_TO`, envía un mail por cada lead nuevo. |
| `LEAD_NOTIFY_TO` | Destinatario(s) del aviso de lead, separados por coma. |
| `LEAD_NOTIFY_FROM` | Remitente verificado en Resend. Default: `ALTUM SCI <onboarding@resend.dev>`. |

Migración pendiente de aplicar a mano en Supabase: `supabase/migrations/20260901_leads_altum_origen.sql` (columnas `origen` y `detalle`, email opcional, nuevos tipos de consulta).
