# NutriCheck Docker Validation Guide

## Overview

This guide provides step-by-step instructions for validating the full Docker build locally with the frontend, backend, and MongoDB database working together.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.0 or higher
- At least 4GB of available RAM
- Ports 3000, 5001, and 27017 available on localhost

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose Network                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Frontend   │  │   Backend    │  │  MongoDB     │      │
│  │  (Nginx)     │  │  (Node.js)   │  │  (Database)  │      │
│  │  Port 3000   │  │  Port 5001   │  │  Port 27017  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  Nginx Config:                                              │
│  - /         → serve React SPA with fallback to /index.html│
│  - /api/*    → proxy to http://backend:5001                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Build Docker Images

```bash
cd "d:\NutriCheck A Cloud-Native Intelligent Nutrition Assessment and Personalized Recommendation System"
docker-compose build
```

**Expected output:**
```
[+] Building 81.3s (backend, frontend)
✔ Image mongo:7 Pulled
✔ Image nutricheck-backend Built
✔ Image nutricheck-frontend Built
```

### 2. Start Services

```bash
docker-compose up -d
```

**Expected output:**
```
[+] up 4/4
✔ Network nutricheck_default                Created
✔ Container nutricheck-mongodb              Healthy
✔ Container nutricheck-backend              Healthy
✔ Container nutricheck-frontend             Started
```

### 3. Verify All Services Are Running

```bash
docker-compose ps
```

**Expected output:**
```
NAME                      IMAGE                COMMAND                 STATUS
nutricheck-mongodb        mongo:7              docker-entrypoint.s...  Up 15s (healthy)
nutricheck-backend        nutricheck-backend   docker-entrypoint.s...  Up 10s (healthy)
nutricheck-frontend       nutricheck-frontend  /docker-entrypoint.…    Up 5s
```

## Service Health Verification

### Test Backend API (Direct Connection)

```bash
curl -i http://localhost:5001/api/health
```

**Expected response (200 OK):**
```json
{
  "status": "OK",
  "message": "Nuricheck API is running",
  "timestamp": "2026-08-17T07:02:05.123Z"
}
```

### Test Frontend (Nginx Web Server)

```bash
curl -i http://localhost:3000
```

**Expected response (200 OK):**
- HTML content of React SPA index.html
- Server header: `nginx/1.31.3`

### Test API Proxy (Frontend → Backend through Nginx)

```bash
curl -i http://localhost:3000/api/health
```

**Expected response (200 OK):**
```json
{
  "status": "OK",
  "message": "Nuricheck API is running",
  "timestamp": "2026-08-17T07:02:05.123Z"
}
```

### Test MongoDB Connection

```bash
docker exec nutricheck-mongodb mongosh --eval "db.adminCommand('ping')"
```

**Expected response:**
```
{ ok: 1 }
```

## Service Access Points

| Service  | URL                    | Purpose                           |
|----------|------------------------|-----------------------------------|
| Frontend | http://localhost:3000  | React SPA web interface           |
| Backend  | http://localhost:5001  | Express API server                |
| MongoDB  | localhost:27017        | Database server (internal only)   |

## API Endpoints

### Health Check

| Endpoint            | Method | Response | Purpose                        |
|---------------------|--------|----------|--------------------------------|
| `/api/health`       | GET    | JSON     | Backend health status          |
| `/health`           | GET    | 404      | Endpoint not available (use `/api/health`) |

### Authentication

| Endpoint            | Method | Purpose                        |
|---------------------|--------|--------------------------------|
| `/api/auth/register`| POST   | Register new user              |
| `/api/auth/login`   | POST   | Login user                     |
| `/api/auth/logout`  | POST   | Logout user                    |

### Profile

| Endpoint            | Method | Purpose                        |
|---------------------|--------|--------------------------------|
| `/api/profile`      | GET    | Get user profile               |
| `/api/profile`      | PUT    | Update user profile            |

### Food Tracking

| Endpoint            | Method | Purpose                        |
|---------------------|--------|--------------------------------|
| `/api/food`         | GET    | Get food entries               |
| `/api/food`         | POST   | Add food entry                 |
| `/api/food/:id`     | DELETE | Delete food entry              |

## Environment Variables

### Backend

```env
NODE_ENV=development          # Node environment
PORT=5001                     # API server port
MONGODB_URI=mongodb://mongodb:27017/nutricheck
JWT_SECRET=change_this_secret_key  # ⚠️ Change in production
JWT_EXPIRE=7d                 # JWT expiration time
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@example.com
```

### Frontend

```env
REACT_APP_API_URL=http://localhost:5001  # Backend API URL
```

## Viewing Logs

### All Services

```bash
docker-compose logs --tail=100 -f
```

### Specific Service

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# MongoDB logs
docker-compose logs -f mongodb
```

## Troubleshooting

### Port Already in Use

**Error:** `Bind for 0.0.0.0:5001 failed: port is already allocated`

**Solution:**
```bash
# Find process using port 5001
netstat -ano | findstr :5001

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or use a different port in docker-compose.yml
```

### MongoDB Connection Failed

**Error:** `getaddrinfo ENOTFOUND mongodb`

**Solutions:**
1. Verify MongoDB container is running: `docker ps | grep mongo`
2. Check MongoDB logs: `docker-compose logs mongodb`
3. Ensure MONGODB_URI uses correct service name: `mongodb://mongodb:27017/nutricheck`

### Frontend Cannot Reach Backend API

**Error:** API calls from frontend return 404 or fail

**Solutions:**
1. Verify Nginx proxy config in `frontend/nginx.conf`:
   - `/api` location must come BEFORE `/` location
   - `proxy_pass` must use correct backend URL
2. Check frontend logs: `docker-compose logs frontend`
3. Test direct backend access: `curl http://localhost:5001/api/health`

### Docker Build Fails

**Error:** `npm install fails with vulnerabilities`

**Solution:**
This is expected and non-critical in development. The build continues with warnings. For production, run:
```bash
npm audit fix
```

## Stopping Services

### Stop All Services

```bash
docker-compose down
```

### Stop and Remove All Data (including MongoDB volume)

```bash
docker-compose down -v
```

### Remove Only Containers (keep data)

```bash
docker-compose stop
```

## Rebuilding After Code Changes

### Rebuild All Images

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Rebuild Specific Service

```bash
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

## Performance Testing

### Check Container Resource Usage

```bash
docker stats
```

### Monitor Network Traffic

```bash
docker stats --no-stream
```

## Testing Checklist

- [ ] Docker images build successfully
- [ ] All three containers (MongoDB, Backend, Frontend) start
- [ ] Health check endpoints return 200 OK
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API accessible at http://localhost:5001/api/health
- [ ] API proxy works through frontend at http://localhost:3000/api/health
- [ ] MongoDB is healthy and responds to ping
- [ ] Frontend can display (check browser console for errors)
- [ ] No memory leaks or excessive CPU usage
- [ ] Logs show no errors or warnings

## Next Steps

After successful validation:

1. **Environment Configuration**: Update environment variables in `docker-compose.yml` for production
2. **Database Migration**: Set up initial database collections and indexes
3. **CI/CD Integration**: Integrate Docker build into Jenkins pipeline (see `JENKINS_CICD.md`)
4. **Kubernetes Deployment**: Deploy to K8s cluster (see `k8s/` directory)
5. **Production Secrets**: Use Docker secrets or ConfigMaps for sensitive data

## References

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Proxy Documentation](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [React Docker Build Best Practices](https://create-react-app.dev/docs/deployment/)

## Validation Timestamp

Last validated: August 17, 2026  
Docker Compose Version: v2.0+  
Docker Version: 20.10+  
Status: ✅ All services healthy and communicating
