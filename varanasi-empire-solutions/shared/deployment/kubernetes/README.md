# Kubernetes Deployment Guide - Varanasi Empire Solutions

Comprehensive, production-ready Kubernetes manifests for deploying the Varanasi Empire Solutions across multiple cloud platforms and on-premise infrastructure.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Directory Structure](#directory-structure)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Deployment](#deployment)
8. [Post-Deployment](#post-deployment)
9. [Monitoring](#monitoring)
10. [Backup & Disaster Recovery](#backup--disaster-recovery)
11. [Scaling](#scaling)
12. [Security](#security)
13. [Troubleshooting](#troubleshooting)
14. [Environment-Specific Deployments](#environment-specific-deployments)
15. [Cloud-Specific Considerations](#cloud-specific-considerations)

## Overview

This deployment package provides complete Kubernetes manifests for deploying the Varanasi Empire Solutions, a comprehensive business ecosystem with 22 enterprise solutions. The manifests are designed for:

- **High Availability**: Multi-replica deployments with pod disruption budgets
- **Auto-Scaling**: Horizontal and vertical pod autoscaling based on metrics
- **Security**: RBAC, NetworkPolicies, security contexts, and secrets management
- **Persistence**: StatefulSets for databases with persistent volumes
- **Monitoring**: Prometheus metrics, health checks, and alerting
- **Load Balancing**: Ingress with SSL/TLS support across multiple domains
- **Multi-Cloud**: AWS EKS, Google GKE, Azure AKS, and on-premise compatibility

## Prerequisites

### Required Software

- **Kubernetes Cluster**: v1.21+ (tested on v1.25+)
- **kubectl**: v1.21+ installed and configured
- **Kustomize**: v3.8+ (included in kubectl v1.14+)
- **Helm** (optional): v3.0+ for package management

### Required Kubernetes Features

- PersistentVolume provisioning (CSI driver or dynamic provisioning)
- Ingress Controller (nginx-ingress recommended)
- Metrics Server (for HPA)
- RBAC enabled
- NetworkPolicy support (optional but recommended)

### Container Registry

- Docker registry access (private or Docker Hub)
- Images must be pre-built and pushed to registry
- Image pull secrets configured for private registries

### DNS and Load Balancing

- DNS configured for domain names
- External load balancer (cloud provider LB or nginx ingress)
- SSL/TLS certificates (auto-provisioned with cert-manager or manually provided)

### Cloud Provider Requirements

#### AWS EKS
- EBS CSI Driver installed
- IAM roles configured for service accounts
- NLB (Network Load Balancer) available

#### Google GKE
- GCE Persistent Disk provisioner enabled
- Cloud DNS configured
- Cloud Load Balancer

#### Azure AKS
- Azure Disk CSI Driver installed
- Azure Container Registry access
- Application Gateway or Azure Load Balancer

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Kubernetes Cluster                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Ingress (nginx) with TLS/SSL                       │   │
│  │  - api.varanasi-empire.example.com                  │   │
│  │  - varanasi-empire.example.com                      │   │
│  └─────────────────────────────────────────────────────┘   │
│           ↓                              ↓                    │
│  ┌──────────────────┐          ┌──────────────────┐         │
│  │ Frontend (3 pods)│          │ Backend (3 pods) │         │
│  │ React SPA        │          │ API Server       │         │
│  │ Port: 3000       │          │ Port: 8080       │         │
│  └──────────────────┘          └──────────────────┘         │
│           │                              │                    │
│           ├──────────────┬───────────────┤                    │
│           │              │               │                    │
│           ↓              ↓               ↓                    │
│  ┌──────────────────┐ ┌─────────────────────────┐           │
│  │ Redis Cache      │ │ PostgreSQL Database     │           │
│  │ (3 pods)         │ │ (3 replicas)            │           │
│  │ Port: 6379       │ │ Port: 5432              │           │
│  │ In-memory        │ │ Persistent Vol: 100Gi   │           │
│  └──────────────────┘ └─────────────────────────┘           │
│           │                      │                            │
│           ↓                      ↓                            │
│  ┌──────────────────────────────────────┐                    │
│  │ Monitoring & Logging                 │                    │
│  │ - Prometheus (metrics collection)    │                    │
│  │ - Fluent Bit (log forwarding)        │                    │
│  │ - PostgreSQL Exporter                │                    │
│  │ - Redis Exporter                     │                    │
│  └──────────────────────────────────────┘                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### File Manifest Description

| File | Purpose | Type | Replicas |
|------|---------|------|----------|
| `namespace.yaml` | Namespace isolation & quotas | Namespace/ResourceQuota | N/A |
| `pv.yaml` | Storage provisioning | PersistentVolume/StorageClass | N/A |
| `postgres-statefulset.yaml` | Primary database | StatefulSet | 3 |
| `postgres-service.yaml` | Database networking | Service | N/A |
| `redis-deployment.yaml` | Cache layer | Deployment | 3 |
| `redis-service.yaml` | Cache networking | Service | N/A |
| `backend-deployment.yaml` | API server | Deployment | 3 |
| `backend-service.yaml` | API networking | Service | N/A |
| `frontend-deployment.yaml` | Web UI | Deployment | 3 |
| `frontend-service.yaml` | Frontend networking | Service | N/A |
| `configmap.yaml` | Non-sensitive config | ConfigMap | N/A |
| `secrets.yaml` | Sensitive data | Secret | N/A |
| `ingress.yaml` | HTTP/HTTPS routing | Ingress | N/A |
| `hpa.yaml` | Auto-scaling | HPA/VPA | N/A |
| `kustomization.yaml` | Configuration management | Kustomization | N/A |

## Directory Structure

```
kubernetes/
├── namespace.yaml              # Namespace and network policies
├── pv.yaml                     # Persistent volumes and storage classes
├── configmap.yaml              # Configuration for all services
├── secrets.yaml                # Secrets template (MUST be customized)
├── postgres-statefulset.yaml   # PostgreSQL database
├── postgres-service.yaml       # PostgreSQL networking
├── redis-deployment.yaml       # Redis cache
├── redis-service.yaml          # Redis networking
├── backend-deployment.yaml     # Backend API
├── backend-service.yaml        # Backend networking
├── frontend-deployment.yaml    # Frontend SPA
├── frontend-service.yaml       # Frontend networking
├── ingress.yaml                # Ingress controller config
├── hpa.yaml                    # Auto-scaling policies
├── kustomization.yaml          # Kustomize configuration
├── README.md                   # This file
├── overlays/
│   ├── dev/
│   │   └── kustomization.yaml
│   ├── staging/
│   │   └── kustomization.yaml
│   └── prod/
│       └── kustomization.yaml
└── scripts/
    ├── deploy.sh               # Deployment script
    ├── destroy.sh              # Cleanup script
    └── verify.sh               # Verification script
```

## Installation

### 1. Prerequisites Installation

#### Install Metrics Server (Required for HPA)
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

#### Install Nginx Ingress Controller
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace
```

#### Install Cert-Manager (for automatic SSL certificates)
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

#### Install Prometheus Operator (Optional, for monitoring)
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

### 2. Prepare Secrets

**CRITICAL**: Update `secrets.yaml` with actual production values!

```bash
# Generate base64-encoded values
echo -n 'your-password' | base64

# Create secrets file with real credentials
cp secrets.yaml secrets-prod.yaml
# Edit secrets-prod.yaml with actual values
```

Example values to update:
- Database passwords
- Redis password
- JWT secrets
- API keys (AWS, Stripe, Twilio, etc.)
- SMTP credentials
- TLS certificates

### 3. Configure Domain Names

Update domain names in these files:
- `ingress.yaml`: Replace `varanasi-empire.example.com`
- `configmap.yaml`: Update `REACT_APP_API_URL`
- `backend-config`: Update `CORS_ORIGINS`

### 4. Configure Container Images

Update image references to your registry:
```yaml
# In backend-deployment.yaml
image: your-registry/backend:v1.0.0

# In frontend-deployment.yaml
image: your-registry/frontend:v1.0.0
```

## Configuration

### ConfigMap Configuration

All non-sensitive configuration is in `configmap.yaml`:

```yaml
# Database configuration
POSTGRES_DB: "varanasi_empire"
POSTGRES_USER: "varanasi_admin"
DATABASE_POOL_MAX: "20"

# Redis configuration
REDIS_TTL_CACHE: "3600"
REDIS_TTL_SESSIONS: "86400"

# Backend API
ENVIRONMENT: "production"
LOG_LEVEL: "info"
SERVER_PORT: "8080"
CORS_ORIGINS: "https://varanasi-empire.example.com"

# Frontend
REACT_APP_API_URL: "https://api.varanasi-empire.example.com/api/v1"
REACT_APP_ENVIRONMENT: "production"
```

### Secrets Configuration

Sensitive data in `secrets.yaml` (base64-encoded):

```yaml
# Database credentials
POSTGRES_PASSWORD: "base64-encoded-password"
REPLICATION_PASSWORD: "base64-encoded-password"

# Redis credentials
REDIS_PASSWORD: "base64-encoded-password"

# JWT and API keys
JWT_SECRET: "base64-encoded-jwt-secret"
AWS_ACCESS_KEY_ID: "base64-encoded-key"
AWS_SECRET_ACCESS_KEY: "base64-encoded-secret"

# TLS Certificate
tls.crt: "base64-encoded-certificate"
tls.key: "base64-encoded-private-key"
```

### Environment Variables by Component

#### PostgreSQL
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Admin user
- `POSTGRES_PASSWORD`: Admin password
- `PGDATA`: Data directory path

#### Redis
- `REDIS_PASSWORD`: Authentication password
- Redis configuration file parameters

#### Backend
- Database connection strings
- Redis connection
- JWT secrets
- AWS credentials
- Email/SMTP settings
- Third-party API keys

#### Frontend
- API endpoint URL
- Analytics configuration
- Feature flags
- Locale settings

## Deployment

### Basic Deployment

```bash
# Navigate to deployment directory
cd kubernetes/

# Create namespace and apply all manifests
kubectl apply -f namespace.yaml
kubectl apply -f pv.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
kubectl apply -f postgres-service.yaml
kubectl apply -f postgres-statefulset.yaml
kubectl apply -f redis-service.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml
```

### Deployment with Kustomize

```bash
# Deploy base configuration
kubectl apply -k ./

# Or with custom namespace
kubectl apply -k ./ --namespace varanasi-empire
```

### Deployment with Environment-Specific Overlays

```bash
# Development environment
kubectl apply -k overlays/dev/

# Staging environment
kubectl apply -k overlays/staging/

# Production environment
kubectl apply -k overlays/prod/
```

### Using Deployment Script

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Deploy with automatic prerequisites check
./scripts/deploy.sh production

# Deploy to specific environment
./scripts/deploy.sh dev
./scripts/deploy.sh staging
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check namespace
kubectl get namespace varanasi-empire

# Check all resources
kubectl get all -n varanasi-empire

# Check pods
kubectl get pods -n varanasi-empire -o wide

# Check statefulsets
kubectl get statefulsets -n varanasi-empire

# Check services
kubectl get services -n varanasi-empire

# Check ingress
kubectl get ingress -n varanasi-empire
```

### 2. Wait for Rollout

```bash
# Wait for backend deployment
kubectl rollout status deployment/backend-deployment -n varanasi-empire

# Wait for frontend deployment
kubectl rollout status deployment/frontend-deployment -n varanasi-empire

# Wait for database
kubectl rollout status statefulset/postgres-statefulset -n varanasi-empire
```

### 3. Check Pod Status

```bash
# Detailed pod information
kubectl describe pod <pod-name> -n varanasi-empire

# View logs
kubectl logs <pod-name> -n varanasi-empire

# Stream logs
kubectl logs -f <pod-name> -n varanasi-empire

# View logs from container
kubectl logs <pod-name> -c <container-name> -n varanasi-empire
```

### 4. Verify Services

```bash
# Check service endpoints
kubectl get endpoints -n varanasi-empire

# Test service connectivity
kubectl run -it --rm debug --image=busybox --restart=Never -- \
  wget -O- http://backend-service:8080/api/v1/health
```

### 5. Verify Database

```bash
# Access PostgreSQL pod
kubectl exec -it postgres-statefulset-0 -n varanasi-empire -- psql -U varanasi_admin -d varanasi_empire

# Check database
\l

# Check tables
\dt

# Exit
\q
```

### 6. Verify Cache

```bash
# Access Redis pod
kubectl exec -it redis-deployment-0 -n varanasi-empire -- redis-cli

# Ping Redis
> PING

# Check memory
> INFO memory

# Exit
> EXIT
```

### 7. Get External IP/DNS

```bash
# For LoadBalancer services
kubectl get svc frontend-lb-service -n varanasi-empire
kubectl get svc backend-lb-service -n varanasi-empire

# For Ingress
kubectl get ingress varanasi-empire-ingress -n varanasi-empire

# Watch for external IP
kubectl get svc -n varanasi-empire --watch
```

## Monitoring

### Prometheus Metrics

Access Prometheus dashboard (if installed):
```bash
kubectl port-forward -n monitoring svc/kube-prometheus-stack-prometheus 9090:9090
# http://localhost:9090
```

### Available Metrics

- `container_cpu_usage_seconds_total`: CPU usage
- `container_memory_usage_bytes`: Memory usage
- `pg_stat_database_numbackends`: Database connections
- `redis_memory_used_bytes`: Redis memory
- `http_requests_total`: HTTP requests
- `http_request_duration_seconds`: Request duration

### Grafana Dashboards (if installed)

```bash
kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80
# http://localhost:3000
# Default: admin/prom-operator
```

### Alert Rules

Configured in `hpa.yaml` PrometheusRule:
- High memory usage (>90%)
- High CPU usage (>80%)
- Pod restarting frequently
- Database connection pool exhausted
- Redis memory high usage (>85%)

### Logs and Events

```bash
# View events
kubectl get events -n varanasi-empire

# View logs for namespace
kubectl logs -n varanasi-empire --all-containers=true -f

# Export logs for analysis
kubectl logs -n varanasi-empire --tail=1000 <pod-name> > pod-logs.txt
```

## Backup & Disaster Recovery

### Database Backups

#### Using pg_dump
```bash
# Backup database
kubectl exec -it postgres-statefulset-0 -n varanasi-empire -- \
  pg_dump -U varanasi_admin -d varanasi_empire > backup.sql

# Restore database
kubectl exec -i postgres-statefulset-0 -n varanasi-empire -- \
  psql -U varanasi_admin -d varanasi_empire < backup.sql
```

#### Using WAL (Write-Ahead Logging)
```bash
# Enable WAL archiving in postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'aws s3 cp %p s3://varanasi-empire-backups/wal/%f'
```

### Persistent Volume Snapshots

```bash
# Create snapshot (AWS EBS)
aws ec2 create-snapshot \
  --volume-id vol-xxxxxxxxxxxxx \
  --description "Varanasi Empire backup"

# List snapshots
aws ec2 describe-snapshots --owner-ids self
```

### Using Velero for Full Cluster Backup

```bash
# Install Velero
velero install \
  --provider aws \
  --bucket varanasi-empire-backups \
  --secret-file credentials-velero

# Create backup
velero backup create varanasi-empire-backup-$(date +%s)

# List backups
velero backup get

# Restore from backup
velero restore create --from-backup varanasi-empire-backup-123456
```

### Disaster Recovery Testing

```bash
# Simulate pod failure
kubectl delete pod <pod-name> -n varanasi-empire

# Simulate node failure
kubectl cordon <node-name>
kubectl drain <node-name> --ignore-daemonsets

# Verify auto-recovery
kubectl get pods -n varanasi-empire -w
```

## Scaling

### Horizontal Scaling (HPA)

The deployment includes HPA with auto-scaling based on CPU and memory:

```bash
# View HPA status
kubectl get hpa -n varanasi-empire

# Detailed HPA info
kubectl describe hpa backend-hpa -n varanasi-empire

# Manual scaling
kubectl scale deployment backend-deployment --replicas=5 -n varanasi-empire
kubectl scale deployment frontend-deployment --replicas=5 -n varanasi-empire
```

### HPA Configuration

Current settings:
- **Backend**: 3-10 replicas (CPU 70%, Memory 80%)
- **Frontend**: 3-8 replicas (CPU 75%, Memory 85%)
- **Redis**: 3-5 replicas (Memory 75%)

Modify in `hpa.yaml`:
```yaml
minReplicas: 3
maxReplicas: 10
metrics:
- type: Resource
  resource:
    name: cpu
    target:
      averageUtilization: 70
```

### Vertical Scaling (VPA)

For automatic resource adjustment:

```bash
# View VPA recommendations
kubectl describe vpa backend-vpa -n varanasi-empire

# Check VPA status
kubectl get vpa -n varanasi-empire
```

### Manual Resource Updates

```bash
# Edit deployment resources
kubectl edit deployment backend-deployment -n varanasi-empire

# Modify in spec.template.spec.containers[0].resources
```

## Security

### RBAC (Role-Based Access Control)

Each component has minimal required permissions:

```bash
# View roles
kubectl get roles -n varanasi-empire

# View role bindings
kubectl get rolebindings -n varanasi-empire

# View service accounts
kubectl get serviceaccounts -n varanasi-empire
```

### Network Policies

Restrict traffic between pods:

```bash
# View network policies
kubectl get networkpolicies -n varanasi-empire

# View policy details
kubectl describe networkpolicy varanasi-empire-policy -n varanasi-empire
```

### Pod Security Policies

```bash
# View security contexts
kubectl get pods -n varanasi-empire -o jsonpath='{.items[0].spec.securityContext}'

# Check pod security standards
kubectl label namespace varanasi-empire pod-security.kubernetes.io/enforce=baseline
```

### Secrets Management

Best practices:
- Never commit secrets to git
- Use external secret management (Vault, AWS Secrets Manager, Azure Key Vault)
- Rotate secrets regularly
- Use separate secrets for each environment

```bash
# View secrets
kubectl get secrets -n varanasi-empire

# Create secret from file
kubectl create secret generic my-secret --from-file=path/to/file

# Create secret from literal
kubectl create secret generic my-secret --from-literal=key=value

# Update secret
kubectl delete secret postgres-secret -n varanasi-empire
kubectl apply -f secrets.yaml -n varanasi-empire
```

### TLS/SSL Configuration

```bash
# View certificates
kubectl get certificate -n varanasi-empire

# Check cert-manager issuer
kubectl get clusterissuer
kubectl describe clusterissuer letsencrypt-prod

# Manual certificate creation
kubectl create secret tls tls-secret \
  --cert=path/to/cert.crt \
  --key=path/to/key.key \
  -n varanasi-empire
```

### Security Scanning

```bash
# Container image scanning
docker scan varanasi-empire/backend:latest

# YAML linting for security
kubesec scan postgres-statefulset.yaml

# Network policy validation
kubectl-who-can get pods
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Pods Stuck in Pending State

```bash
# Check pod events
kubectl describe pod <pod-name> -n varanasi-empire

# Common causes:
# - Insufficient resources
# - Persistent volume not available
# - Image pull secret missing
# - Node selector no matching nodes

# Check node resources
kubectl describe nodes | grep -A 5 Allocated

# Check persistent volumes
kubectl get pv
kubectl describe pv <pv-name>
```

#### 2. CrashLoopBackOff Error

```bash
# Check logs
kubectl logs <pod-name> -n varanasi-empire --previous

# Common causes:
# - Database connection failed
# - Missing environment variables
# - Invalid configuration
# - Insufficient memory/cpu

# Increase resources
kubectl set resources deployment backend-deployment \
  --limits=cpu=1000m,memory=1Gi \
  --requests=cpu=500m,memory=512Mi \
  -n varanasi-empire
```

#### 3. Database Connection Issues

```bash
# Verify database is running
kubectl get statefulset postgres-statefulset -n varanasi-empire

# Check database logs
kubectl logs postgres-statefulset-0 -n varanasi-empire

# Test connection
kubectl exec -it postgres-statefulset-0 -n varanasi-empire -- \
  psql -U varanasi_admin -d varanasi_empire -c "SELECT version();"

# Check if database is ready
kubectl wait --for=condition=Ready pod/postgres-statefulset-0 \
  -n varanasi-empire --timeout=300s
```

#### 4. Ingress Not Working

```bash
# Check ingress status
kubectl get ingress -n varanasi-empire

# Check ingress details
kubectl describe ingress varanasi-empire-ingress -n varanasi-empire

# Check ingress controller logs
kubectl logs -n ingress-nginx deployment/nginx-ingress-controller -f

# Common fixes:
# - Ensure ingress controller is running
# - Check DNS resolution
# - Verify backend services are accessible
# - Check TLS certificate status
```

#### 5. Certificate Issues

```bash
# Check certificate status
kubectl get certificate -n varanasi-empire

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager -f

# Check ACME order
kubectl get order -n varanasi-empire

# Force certificate renewal
kubectl delete certificate varanasi-empire-cert -n varanasi-empire
kubectl apply -f ingress.yaml -n varanasi-empire
```

#### 6. Resource Limits Exceeded

```bash
# Check resource quotas
kubectl describe resourcequota varanasi-empire-quota -n varanasi-empire

# Check current usage
kubectl describe namespace varanasi-empire

# Increase quota
kubectl edit resourcequota varanasi-empire-quota -n varanasi-empire
```

### Debugging Techniques

```bash
# Execute command in pod
kubectl exec -it <pod-name> -n varanasi-empire -- /bin/sh

# Port forward to pod
kubectl port-forward <pod-name> 8080:8080 -n varanasi-empire

# Copy files from pod
kubectl cp <pod-name>:/path/to/file ./local-file -n varanasi-empire

# Copy files to pod
kubectl cp ./local-file <pod-name>:/path/to/file -n varanasi-empire

# Get pod details in YAML
kubectl get pod <pod-name> -o yaml -n varanasi-empire

# Get resource events
kubectl get events -n varanasi-empire --sort-by='.lastTimestamp'

# Debug pod startup
kubectl describe pod <pod-name> -n varanasi-empire | grep -A 20 Events
```

## Environment-Specific Deployments

### Development Environment

```bash
# Deploy development with reduced replicas and resources
kubectl apply -k overlays/dev/

# Or with reduced resources
kubectl patch deployment backend-deployment --patch '{"spec":{"replicas":1}}' -n varanasi-empire
```

Development overlay configuration:
- 1 replica per service (instead of 3)
- Lower resource requests
- Relaxed HPA settings
- Debug logging enabled

### Staging Environment

```bash
kubectl apply -k overlays/staging/
```

Staging overlay configuration:
- 2 replicas per service
- Production-like resources
- Load testing enabled
- Monitoring enabled

### Production Environment

```bash
kubectl apply -k overlays/prod/
```

Production overlay configuration:
- 3+ replicas per service
- Full resource limits
- Auto-scaling enabled
- Enhanced monitoring
- Backup jobs
- Security hardening

## Cloud-Specific Considerations

### AWS EKS

```bash
# Create EKS cluster
eksctl create cluster --name varanasi-empire --region us-west-2

# Install EBS CSI Driver
helm repo add aws-ebs-csi-driver https://kubernetes-sigs.github.io/aws-ebs-csi-driver
helm install aws-ebs-csi-driver aws-ebs-csi-driver/aws-ebs-csi-driver -n kube-system

# Update storage class
kubectl patch storageclass fast-ssd -p '{"provisioner":"ebs.csi.aws.com"}'

# Enable AWS Load Balancer Controller
helm install aws-load-balancer-controller \
  eks/aws-load-balancer-controller \
  -n kube-system
```

### Google GKE

```bash
# Create GKE cluster
gcloud container clusters create varanasi-empire --zone us-central1-a

# Install GKE Autopilot
gcloud container clusters create varanasi-empire --enable-autopilot

# Enable workload identity
gcloud iam service-accounts create varanasi-empire-sa

# Update ingress for GCP
kubectl patch ingress varanasi-empire-ingress -p '{"metadata":{"annotations":{"kubernetes.io/ingress.class":"gce"}}}'
```

### Azure AKS

```bash
# Create AKS cluster
az aks create --resource-group myResourceGroup --name varanasi-empire

# Get credentials
az aks get-credentials --resource-group myResourceGroup --name varanasi-empire

# Enable monitoring
az aks enable-addons --resource-group myResourceGroup --name varanasi-empire --addons monitoring

# Update storage class
kubectl patch storageclass default -p '{"provisioner":"disk.csi.azure.com"}'
```

### On-Premise Kubernetes

```bash
# Use local storage
kubectl apply -f - <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
EOF

# Configure NFS if available
# Update pv.yaml with NFS server details
kubectl apply -f pv-nfs.yaml
```

## Cleanup and Undeployment

### Graceful Shutdown

```bash
# Delete all resources in namespace
kubectl delete namespace varanasi-empire

# Or delete specific resources
kubectl delete deployment -n varanasi-empire --all
kubectl delete statefulset -n varanasi-empire --all
kubectl delete service -n varanasi-empire --all
kubectl delete ingress -n varanasi-empire --all
kubectl delete pvc -n varanasi-empire --all

# Check persistent volumes
kubectl get pv

# Delete persistent volumes (caution: data loss!)
kubectl delete pv postgres-pv redis-pv
```

### Using Cleanup Script

```bash
./scripts/destroy.sh varanasi-empire
```

### Backup Before Deletion

```bash
# Backup database
kubectl exec -it postgres-statefulset-0 -n varanasi-empire -- \
  pg_dump -U varanasi_admin -d varanasi_empire | gzip > backup-$(date +%s).sql.gz

# Backup persistent volumes
velero backup create pre-deletion-backup-$(date +%s)
```

## Additional Resources

### Documentation
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes API Reference](https://kubernetes.io/docs/reference/)
- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

### Tools
- [Kustomize Documentation](https://kustomize.io/)
- [Helm Documentation](https://helm.sh/docs/)
- [Kubectx - Context Switcher](https://github.com/ahmetb/kubectx)

### Security
- [Kubernetes Security Best Practices](https://kubernetes.io/docs/concepts/security/)
- [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [RBAC Documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)

### Monitoring
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [OpenTelemetry](https://opentelemetry.io/)

## Support and Troubleshooting

### Getting Help

1. Check the [Kubernetes Slack](https://kubernetes.slack.com/)
2. Visit [Kubernetes Community](https://kubernetes.io/community/)
3. Check application logs: `kubectl logs <pod-name>`
4. Review events: `kubectl get events`
5. Describe resources: `kubectl describe <resource>`

### Reporting Issues

When reporting issues, include:
- Kubernetes version: `kubectl version`
- Cluster info: `kubectl cluster-info`
- Pod description: `kubectl describe pod`
- Recent logs: `kubectl logs <pod-name>`
- Events: `kubectl get events`

## License

These manifests are part of the Varanasi Empire Solutions project.

## Version History

- **v1.0.0** (2024-11-18) - Initial production release
  - Complete 3-tier architecture
  - Auto-scaling and high availability
  - Monitoring and alerting
  - Multi-cloud support
  - Comprehensive documentation

---

**Last Updated**: 2024-11-18
**Maintained By**: Varanasi Empire DevOps Team
**Status**: Production Ready
