# Jenkins CI/CD for NutriCheck

## Overview

This project is designed to run in a Dockerized, cloud-native workflow. Jenkins automates testing, image build, registry push, and Kubernetes deployment while keeping the existing NutriCheck application intact.

## Pipeline stages

1. Checkout source code
2. Install backend dependencies
3. Run backend tests
4. Build the React frontend
5. Build Docker images for frontend and backend
6. Push images to Azure Container Registry
7. Deploy manifests to Kubernetes

## Example Jenkins setup

- Install Jenkins with Docker and Kubernetes plugins
- Add a Jenkins credential named `azure-acr-credentials`
- Configure the repository to trigger on push to the `main` branch
- Ensure Docker and `kubectl` are installed on the Jenkins agent

## Required environment values

- Azure Container Registry URL, for example `myregistry.azurecr.io`
- Docker login username/password for ACR
- Kubernetes cluster access via `kubectl`

## Example commands

```bash
cd backend
npm ci
node --test tests/health.test.js

cd ../frontend
npm ci
npm run build

cd ..
docker build -t nutricheck-backend:latest -f Dockerfile .
docker build -t nutricheck-frontend:latest --build-arg REACT_APP_API_URL=http://localhost:5001 ./frontend
```

## Azure ACR flow

```bash
az acr login --name <registry-name>
docker tag nutricheck-backend:latest <registry-name>.azurecr.io/nutricheck-backend:latest
docker push <registry-name>.azurecr.io/nutricheck-backend:latest
```

## Kubernetes deployment

```bash
kubectl apply -f k8s/
```

## Notes

- The current project remains a Node.js + Express + React stack.
- This pipeline adds automation around the existing app without rewriting it.
- Secrets should never be committed to Git; use Jenkins credentials and Kubernetes secrets.
