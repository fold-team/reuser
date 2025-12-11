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

## Running with Skaffold (Kubernetes)

Prerequisites:
- Kubernetes cluster (Minikube, Docker Desktop, Kind, etc.)
- Skaffold installed

First, create the values configuration:
```bash
cp k8s/chart/values.example.yaml k8s/chart/values.yaml
```

### Development Mode
Runs the application in development mode with hot-reloading enabled.

```bash
skaffold dev
```

### Production Mode
Builds and runs the optimized production image using the `production` profile.

```bash
skaffold run -p production
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
