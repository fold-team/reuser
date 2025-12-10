This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
> bun install
> cp .env.example .env
```

Change DATABASE_URL to your postgres url

```bash
> bunx prisma generate
> bunx prisma migrate dev
> bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
