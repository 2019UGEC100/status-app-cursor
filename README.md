## StatusPage (MVP)

Minimal status page app with:

- Authentication and organizations (Clerk)
- Multi-tenant services (CRUD) with status history
- Incidents and updates; associate services
- Public status pages (`/s` and `/s/[orgId]`)
- Optional realtime via Pusher (no-op if keys missing)

### Tech

- Next.js App Router, TypeScript, Tailwind
- Prisma + SQLite (file DB, easy to deploy/migrate)
- Clerk for auth + org management
- Pusher (optional) for realtime

### Local setup

1) Install deps

```bash
npm install
```

2) Copy env and fill values

```bash
cp .env.example .env
# Fill Clerk keys; Pusher is optional
```

Required envs:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard`
- `DATABASE_URL="file:./dev.db"`
- `ADMIN_EMAILS=you@example.com` (comma-separated allowlist)
- Pusher (optional): `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`, `PUSHER_USE_TLS=true`

3) Create DB and generate client

```bash
npx prisma migrate dev --name init
```

4) Run

```bash
npm run dev
# http://localhost:3000
```

5) Sign up with your admin email, create/select an organization from the header switcher, then:

- Manage services at `/dashboard/services`
- Manage incidents at `/dashboard/incidents`
- Public page at `/s` (demo) or `/s/[orgId]`

### Notes on organizations

- The dashboard is multi-tenant; all data is filtered by the active Clerk organization (`orgId`).
- The admin allowlist (`ADMIN_EMAILS`) restricts dashboard access.

### Realtime (optional)

- If Pusher envs are set, the API will trigger org-scoped events. If not set, it is a no-op (no errors).

### Deploy to Vercel

1) Push to GitHub (new repo)

```bash
git init
git add -A
git commit -m "StatusPage MVP"
# git remote add origin <your-repo-url>
# git push -u origin main
```

2) Create a Vercel project and import the repo.

3) In Vercel → Settings → Environment Variables, add the same envs from `.env`.

4) Build & deploy. The Prisma SQLite file will be created per deployment. For production, you can swap `DATABASE_URL` to a hosted Postgres/MySQL and run migrations.

### Troubleshooting

- If you see Clerk errors locally, ensure the site URL (e.g., `http://localhost:3000`) is allowed in your Clerk dashboard.
- If you see transient dev errors about missing Next.js chunks, stop the dev server, `rm -rf .next`, and re-run `npm run dev`.
- If service status updates 500 in dev, ensure Pusher keys are present or rely on the built-in no-op (already handled); reload the page after changing envs.

### Roadmap (nice-to-have)

- Better incident timeline and service-level history UI
- Public page per org slug (vanity URL) and custom domains
- Email/webhook notifications for incidents

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
