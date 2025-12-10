# Deployment Guide

This guide explains how to deploy the Reuser application to a remote Kubernetes cluster using Skaffold.

## Prerequisites

- Docker installed and running
- kubectl configured to connect to your remote cluster
- Skaffold installed (https://skaffold.dev/docs/install/)
- Access to a Kubernetes cluster

## Quick Start

### 1. Create Kubernetes Secret

Copy the example secret file and update with your credentials:

```bash
cp k8s/secret.yaml.example k8s/secret.yaml
```

Edit `k8s/secret.yaml` and update the following values:
- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Strong password for the database
- `DATABASE_URL`: Full PostgreSQL connection string

**IMPORTANT:** Never commit `k8s/secret.yaml` to version control!

### 2. Configure kubectl Context

Ensure your kubectl is configured to point to your remote cluster:

```bash
kubectl config current-context
kubectl config use-context <your-cluster-context>
```

### 3. Deploy with Skaffold

For development with live sync:

```bash
skaffold dev
```

For production deployment:

```bash
skaffold run
```

To delete all resources:

```bash
skaffold delete
```

## Architecture

The deployment consists of:

1. **Namespace**: `reuser` - Isolated namespace for all resources
2. **PostgreSQL Database**:
   - StatefulSet with persistent storage (10Gi PVC)
   - Internal service for cluster communication
3. **Database Migration Job**:
   - Runs Prisma migrations on deployment
   - Waits for PostgreSQL to be ready
4. **Application Deployment**:
   - Next.js application with 2 replicas
   - Health checks configured
   - Auto-restarts on failure
5. **LoadBalancer Service**:
   - Exposes the application on port 80
   - Routes to application port 3000

## Configuration

### ConfigMap (k8s/configmap.yaml)

Non-sensitive configuration:
- Database name
- Database host
- Database port
- Node environment

### Secret (k8s/secret.yaml)

Sensitive credentials:
- Database username
- Database password
- Full DATABASE_URL connection string

### Storage

PostgreSQL uses a PersistentVolumeClaim with:
- 10Gi storage
- ReadWriteOnce access mode
- `standard` storage class (modify if your cluster uses a different class)

## Accessing the Application

After deployment:

1. Get the LoadBalancer IP:
```bash
kubectl get svc -n reuser reuser-app
```

2. Access the application at `http://<EXTERNAL-IP>`

With Skaffold port forwarding (automatic in dev mode):
```bash
http://localhost:3000
```

## Monitoring

Check deployment status:
```bash
kubectl get all -n reuser
```

View application logs:
```bash
kubectl logs -n reuser -l app=reuser-app -f
```

View database logs:
```bash
kubectl logs -n reuser -l app=postgres -f
```

Check migration job:
```bash
kubectl logs -n reuser -l app=db-migration
```

## Scaling

Scale the application:
```bash
kubectl scale deployment reuser-app -n reuser --replicas=3
```

## Storage Class

If your cluster uses a different storage class than `standard`, update `k8s/postgres-pvc.yaml`:

```yaml
spec:
  storageClassName: your-storage-class
```

Common storage classes:
- GKE: `standard` or `standard-rwo`
- EKS: `gp2` or `gp3`
- AKS: `default` or `managed-premium`
- DigitalOcean: `do-block-storage`

## Troubleshooting

### Pods not starting

Check events:
```bash
kubectl describe pod -n reuser <pod-name>
```

### Database connection issues

Verify secret is created:
```bash
kubectl get secret -n reuser db-secret
```

Test database connection:
```bash
kubectl run -it --rm debug --image=postgres:16-alpine --restart=Never -n reuser -- psql $DATABASE_URL
```

### Migration failures

Check migration job logs:
```bash
kubectl logs -n reuser job/db-migration
```

Delete and recreate the job:
```bash
kubectl delete job -n reuser db-migration
kubectl apply -f k8s/db-migration-job.yaml
```

## Cleaning Up

Remove all resources:
```bash
skaffold delete
```

Or manually:
```bash
kubectl delete namespace reuser
```

**Note:** This will delete the PersistentVolumeClaim and all data!
