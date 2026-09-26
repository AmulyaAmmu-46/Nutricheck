# NutriCheck Containerized Deployment Flow

## Document Purpose

This document outlines the complete containerized deployment pipeline for NutriCheck, from local development through production deployment across different cloud platforms (AWS, Azure, Kubernetes).

## Deployment Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     NutriCheck Deployment Pipeline                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [Development]          [Build]            [Test]        [Deploy]     │
│       ↓                   ↓                  ↓               ↓          │
│  ┌─────────┐  ┌────────────────────┐  ┌──────────┐  ┌──────────────┐ │
│  │ Git     │→ │ Docker Build       │→ │ Docker   │→ │ Cloud       │ │
│  │ Commit  │  │ & Compose Test     │  │ Registry │  │ Deploy      │ │
│  └─────────┘  └────────────────────┘  └──────────┘  └──────────────┘ │
│                                                            ↓           │
│                                                  ┌──────────────────┐ │
│                                                  │ AWS ECS/EKS      │ │
│                                                  │ Azure ACI/AKS    │ │
│                                                  │ Kubernetes       │ │
│                                                  └──────────────────┘ │
│                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

## Phase 1: Local Development & Testing

### 1.1 Development Workflow

```bash
# 1. Clone repository
git clone <repository-url>
cd "NutriCheck A Cloud-Native..."

# 2. Make code changes (frontend/backend)
# Edit files in ./frontend or ./backend

# 3. Build Docker images locally
docker-compose build

# 4. Run containers locally
docker-compose up -d

# 5. Verify all services
docker-compose ps
curl http://localhost:3000         # Frontend
curl http://localhost:5001/api/health  # Backend

# 6. View logs for debugging
docker-compose logs -f

# 7. Stop services when done
docker-compose down
```

### 1.2 Local Testing Checklist

- [ ] All containers build without errors
- [ ] MongoDB initializes successfully
- [ ] Backend connects to MongoDB
- [ ] Frontend loads in browser
- [ ] API proxy works (frontend → backend)
- [ ] Health check endpoints respond
- [ ] No console errors in browser dev tools
- [ ] Network traffic shows successful API calls

### 1.3 Code Quality Checks

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ../frontend
npm test

# ESLint
npm run lint
```

## Phase 2: Docker Image Build & Registry

### 2.1 Build Process

```dockerfile
# Backend Dockerfile (multi-stage build)
FROM node:18-alpine AS base
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend ./
EXPOSE 5001
CMD ["node", "server.js"]

# Frontend Dockerfile (multi-stage build)
FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

FROM nginx:alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2.2 Image Tagging Convention

```bash
# Tag images with version
docker tag nutricheck-backend:latest myregistry.azurecr.io/nutricheck-backend:v1.0.0
docker tag nutricheck-frontend:latest myregistry.azurecr.io/nutricheck-frontend:v1.0.0

# Push to container registry
docker push myregistry.azurecr.io/nutricheck-backend:v1.0.0
docker push myregistry.azurecr.io/nutricheck-frontend:v1.0.0
```

### 2.3 Container Registry Setup

#### Azure Container Registry (ACR)

```bash
# Create ACR
az acr create --resource-group myResourceGroup \
  --name nutricheck --sku Basic

# Login
az acr login --name nutricheck

# Tag and push
docker tag nutricheck-backend:latest nutricheck.azurecr.io/backend:v1.0.0
docker push nutricheck.azurecr.io/backend:v1.0.0
```

#### AWS Elastic Container Registry (ECR)

```bash
# Create ECR repository
aws ecr create-repository --repository-name nutricheck-backend

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag nutricheck-backend:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/nutricheck-backend:v1.0.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/nutricheck-backend:v1.0.0
```

## Phase 3: Container Orchestration

### 3.1 Docker Compose Deployment (Single Host)

**Use Case:** Development, staging, or small production deployments

```bash
# Deploy with environment file
docker-compose -f docker-compose.yml --env-file .env.production up -d

# Scale services
docker-compose up -d --scale backend=3

# Monitor
docker-compose logs -f
docker stats
```

### 3.2 Kubernetes Deployment (Multi-Host Cluster)

**Use Case:** Production, high-availability, auto-scaling

#### Kubernetes Manifests

```yaml
# deployment.yaml - Backend
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nutricheck-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nutricheck-backend
  template:
    metadata:
      labels:
        app: nutricheck-backend
    spec:
      containers:
      - name: backend
        image: myregistry.azurecr.io/nutricheck-backend:v1.0.0
        ports:
        - containerPort: 5001
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: nutricheck-secrets
              key: mongodb-uri
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 5001
          initialDelaySeconds: 10
          periodSeconds: 5

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nutricheck-backend
spec:
  selector:
    app: nutricheck-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5001
  type: LoadBalancer
```

#### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace nutricheck

# Create secrets
kubectl create secret generic nutricheck-secrets \
  --from-literal=mongodb-uri='mongodb://mongodb:27017/nutricheck' \
  -n nutricheck

# Create ConfigMap
kubectl create configmap nutricheck-config \
  --from-literal=NODE_ENV=production \
  -n nutricheck

# Apply manifests
kubectl apply -f k8s/ -n nutricheck

# Monitor deployment
kubectl get deployments -n nutricheck
kubectl get pods -n nutricheck
kubectl logs <pod-name> -n nutricheck
```

## Phase 4: Cloud Platform Deployments

### 4.1 AWS ECS Deployment

#### Prerequisites

- AWS account with ECS permissions
- EC2 instances or Fargate capacity
- ECR repositories created

#### Deployment Steps

```bash
# 1. Create ECS cluster
aws ecs create-cluster --cluster-name nutricheck-cluster

# 2. Register task definition
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json

# 3. Create service
aws ecs create-service \
  --cluster nutricheck-cluster \
  --service-name nutricheck-backend \
  --task-definition nutricheck-backend:1 \
  --desired-count 3

# 4. Update service
aws ecs update-service \
  --cluster nutricheck-cluster \
  --service nutricheck-backend \
  --desired-count 5

# 5. Monitor service
aws ecs describe-services \
  --cluster nutricheck-cluster \
  --services nutricheck-backend
```

#### Task Definition Example

```json
{
  "family": "nutricheck-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/nutricheck-backend:v1.0.0",
      "portMappings": [
        {
          "containerPort": 5001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "5001"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:nutricheck/mongodb-uri"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/nutricheck-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 4.2 Azure Container Instances (ACI) Deployment

#### Prerequisites

- Azure CLI installed
- Azure Container Registry
- Resource group created

#### Deployment Steps

```bash
# 1. Create resource group
az group create --name nutricheck-rg --location eastus

# 2. Deploy container group
az container create \
  --resource-group nutricheck-rg \
  --name nutricheck-app \
  --image nutricheck.azurecr.io/backend:v1.0.0 \
  --cpu 2 --memory 1 \
  --registry-login-server nutricheck.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --environment-variables \
    NODE_ENV=production \
    PORT=5001 \
  --ports 5001

# 3. Check status
az container show \
  --resource-group nutricheck-rg \
  --name nutricheck-app
```

### 4.3 Azure Kubernetes Service (AKS) Deployment

#### Prerequisites

- AKS cluster created
- kubectl configured
- ACR integrated with AKS

#### Deployment Steps

```bash
# 1. Create AKS cluster
az aks create --resource-group nutricheck-rg \
  --name nutricheck-aks \
  --node-count 3 \
  --attach-acr nutricheck

# 2. Get credentials
az aks get-credentials \
  --resource-group nutricheck-rg \
  --name nutricheck-aks

# 3. Deploy application
kubectl apply -f k8s/

# 4. Expose service
kubectl expose deployment nutricheck-backend \
  --type=LoadBalancer \
  --port=80 \
  --target-port=5001

# 5. Monitor
kubectl get svc
kubectl get pods
```

## Phase 5: CI/CD Integration

### 5.1 Jenkins Pipeline

See `JENKINS_CICD.md` for complete Jenkins pipeline configuration.

**Key Stages:**
1. **Source Control** - Fetch code from Git
2. **Build** - Compile and create Docker images
3. **Test** - Run unit tests, integration tests
4. **Security Scan** - Container image scanning
5. **Registry Push** - Push images to container registry
6. **Deploy Staging** - Deploy to staging environment
7. **Integration Tests** - Run end-to-end tests
8. **Deploy Production** - Blue-green deployment to production
9. **Smoke Tests** - Verify production deployment

### 5.2 GitHub Actions CI/CD

```yaml
name: Build and Deploy

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker images
        run: docker-compose build
      
      - name: Push to registry
        env:
          REGISTRY: myregistry.azurecr.io
        run: |
          docker tag nutricheck-backend $REGISTRY/backend:${{ github.sha }}
          docker push $REGISTRY/backend:${{ github.sha }}
      
      - name: Deploy to AKS
        run: |
          kubectl set image deployment/nutricheck-backend \
            backend=$REGISTRY/backend:${{ github.sha }}
```

## Phase 6: Monitoring & Observability

### 6.1 Container Logging

```bash
# Docker Compose
docker-compose logs -f --tail=100

# Kubernetes
kubectl logs <pod-name> -f
kubectl logs -l app=nutricheck-backend -f

# Azure Container Instances
az container logs --resource-group nutricheck-rg \
  --name nutricheck-app
```

### 6.2 Health Checks

**Liveness Probe** - Is the container running?
```bash
curl http://localhost:5001/api/health
```

**Readiness Probe** - Can the container handle traffic?
```bash
curl http://localhost:5001/api/health
```

### 6.3 Metrics & Alerts

#### Container Resource Usage

```bash
# Docker
docker stats nutricheck-backend

# Kubernetes
kubectl top pods -n nutricheck
kubectl top nodes
```

#### Monitoring Stack

```yaml
# Prometheus + Grafana setup
- Prometheus: Container and application metrics
- Grafana: Visualization and dashboards
- AlertManager: Alert routing and management
```

## Phase 7: Production Checklist

Before deploying to production:

- [ ] All code reviewed and tested locally
- [ ] Docker images scanned for vulnerabilities
- [ ] Environment variables configured for production
- [ ] Database backups and recovery plan in place
- [ ] SSL/TLS certificates installed
- [ ] Load balancer configured
- [ ] Auto-scaling policies defined
- [ ] Monitoring and alerting active
- [ ] Logging centralized (ELK, Splunk, etc.)
- [ ] Disaster recovery plan documented
- [ ] Security group/firewall rules configured
- [ ] Database migration tested
- [ ] Secrets management configured (AWS Secrets Manager, Azure Key Vault)
- [ ] CDN configured for static assets
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] API documentation updated

## Phase 8: Troubleshooting Deployment Issues

### Common Issues & Solutions

#### Issue: Container exits immediately

**Symptoms:** Container status shows `Exited (1)`

**Solutions:**
1. Check logs: `docker-compose logs backend`
2. Verify environment variables are set
3. Check MongoDB connection: `docker exec nutricheck-mongodb mongosh --eval "db.adminCommand('ping')"`
4. Verify image was built correctly: `docker images`

#### Issue: Database connection timeout

**Symptoms:** Backend logs show `connection timeout`

**Solutions:**
1. Verify MongoDB is running: `docker-compose ps mongodb`
2. Check MONGODB_URI environment variable
3. Verify network connectivity between containers
4. Check MongoDB logs: `docker-compose logs mongodb`

#### Issue: API calls return 404 from frontend

**Symptoms:** Frontend can't reach backend APIs

**Solutions:**
1. Verify Nginx proxy configuration: Check `frontend/nginx.conf`
2. Test direct backend access: `curl http://localhost:5001/api/health`
3. Check frontend logs: `docker-compose logs frontend`
4. Verify `/api` location comes before `/` in nginx config

#### Issue: High memory usage

**Symptoms:** Container memory usage > 90%

**Solutions:**
1. Monitor resource usage: `docker stats`
2. Increase container memory limit in docker-compose.yml
3. Check for memory leaks in application code
4. Profile application: Add profiling tools and review heap dumps

## Phase 9: Scaling Strategies

### Horizontal Scaling (Add more instances)

```bash
# Docker Compose
docker-compose up -d --scale backend=5

# Kubernetes
kubectl scale deployment nutricheck-backend --replicas=5

# AWS ECS
aws ecs update-service --cluster nutricheck-cluster \
  --service nutricheck-backend --desired-count 5
```

### Vertical Scaling (Increase resources)

```yaml
# Kubernetes resource requests/limits
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

### Auto-Scaling

```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nutricheck-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nutricheck-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Phase 10: Rollback & Recovery

### Rollback Deployment

```bash
# Kubernetes
kubectl rollout history deployment/nutricheck-backend
kubectl rollout undo deployment/nutricheck-backend --to-revision=1

# AWS ECS
aws ecs update-service --cluster nutricheck-cluster \
  --service nutricheck-backend \
  --task-definition nutricheck-backend:2
```

### Database Recovery

```bash
# Backup MongoDB
docker exec nutricheck-mongodb mongodump --out /backup

# Restore MongoDB
docker exec nutricheck-mongodb mongorestore /backup
```

## Maintenance Windows

### Update Schedule

| Component | Frequency | Downtime |
|-----------|-----------|----------|
| OS/Kernel | Monthly | Blue-green deployment |
| Node.js Runtime | Quarterly | Blue-green deployment |
| Dependencies | As needed | Rolling update |
| Database | Quarterly | Scheduled maintenance window |

## References

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [AWS ECS Guide](https://docs.aws.amazon.com/ecs/)
- [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/)
- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-08-17 | Initial containerized deployment documentation |

## Approval

- **Author**: DevOps Team
- **Date**: August 17, 2026
- **Status**: ✅ Validated in Local Environment
