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

### Production build

```bash
> bun run build
> bun start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


Update this application so we can run it in a remote cluster with `skaffold dev`.

Requirements:
* Create a skaffold config file
* Create a k8s folder with all necessary configs
* Include a postgres instance that stores state in a pvc in the k8s config
