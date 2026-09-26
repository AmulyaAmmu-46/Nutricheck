# NutriCheck Docker Guide

## Overview

This project uses a lightweight Docker setup for local development and production deployment. The application is containerized with:

- **Frontend**: React SPA served through Nginx
- **Backend**: Express.js API server (Node.js)
- **Database**: MongoDB 7.0
- **Orchestration**: Docker Compose (development) and Kubernetes (production)

## Quick Start

### Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.0 or higher
- At least 4GB available RAM
- Ports 3000, 5001, and 27017 available

### Build and Run Locally

```bash
# Navigate to project directory
cd "d:\NutriCheck A Cloud-Native Intelligent Nutrition Assessment and Personalized Recommendation System"

# Build Docker images
docker-compose build

# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/api/health

## Services Overview

### MongoDB (Database)

```yaml
image: mongo:7
container_name: nutricheck-mongodb
port: 27017
```

- Persistent volume: `mongodb_data`
- Health check: `mongosh --eval "db.adminCommand('ping')"`
- Database name: `nutricheck`

### Backend (Node.js Express API)

```yaml
image: nutricheck-backend (built from Dockerfile)
container_name: nutricheck-backend
port: 5001
```

- Environment: See `docker-compose.yml`
- Health check: `curl http://localhost:5001/api/health`
- Dependencies: Requires healthy MongoDB connection

### Frontend (React SPA + Nginx)

```yaml
image: nutricheck-frontend (built from frontend/Dockerfile)
container_name: nutricheck-frontend
port: 3000
```

- Built with multi-stage Docker build
- Served through Nginx reverse proxy
- API requests proxied to backend via `/api` location
- Static assets cached and optimized

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stop Services

```bash
# Stop all containers (data persists)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Execute Commands in Containers

```bash
# Backend - install dependencies
docker-compose exec backend npm install

# MongoDB - access shell
docker-compose exec mongodb mongosh
```

### Rebuild Images

```bash
# Rebuild all images
docker-compose build --no-cache

# Rebuild specific service
docker-compose build --no-cache frontend
```

## Environment Configuration

### Backend Environment Variables

Edit `docker-compose.yml` to configure:

```env
NODE_ENV=development          # Set to 'production' for production
PORT=5001                     # API port
MONGODB_URI=mongodb://mongodb:27017/nutricheck
JWT_SECRET=change_this_secret_key  # ⚠️ Change in production!
JWT_EXPIRE=7d                 # JWT token expiration
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@example.com
```

### Frontend Environment Variables

Configured during Docker build via build args:

```env
REACT_APP_API_URL=http://localhost:5001
```

## Networking

All services communicate within Docker's internal network `nutricheck_default`:

- Frontend (port 80 in container) ← exposed on 3000
- Backend (port 5001 in container) ← exposed on 5001
- MongoDB (port 27017 in container) ← exposed on 27017

### Nginx Reverse Proxy Configuration

The frontend Nginx proxy is configured in `frontend/nginx.conf`:

```nginx
# Route /api/* to backend
location /api {
  proxy_pass http://backend:5001;
  # Headers forwarding...
}

# Route all other requests to React SPA
location / {
  try_files $uri $uri/ /index.html;
}
```

## Troubleshooting

### Ports Already in Use

```bash
# Find process using port
netstat -ano | findstr :5001

# Windows: Kill process
taskkill /PID <PID> /F

# Or configure different ports in docker-compose.yml
```

### Database Connection Issues

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Test MongoDB connection
docker-compose exec backend curl mongodb:27017

# Check MongoDB logs
docker-compose logs mongodb
```

### Frontend Cannot Reach Backend

1. Verify Nginx proxy configuration: `frontend/nginx.conf`
2. Check that `/api` location comes before `/` location
3. Test backend directly: `curl http://localhost:5001/api/health`
4. Check frontend logs: `docker-compose logs frontend`

### Out of Disk Space

```bash
# Clean up unused images and containers
docker system prune

# Clean everything including volumes
docker system prune -a --volumes
```

## Advanced Configuration

### Resource Limits

Configure memory and CPU limits in `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Custom Networks

```bash
# Create custom network
docker network create nutricheck-network

# Use in docker-compose.yml
networks:
  default:
    name: nutricheck-network
```

### Volume Management

```bash
# List volumes
docker volume ls | grep nutricheck

# Inspect volume
docker volume inspect nutricheck_mongodb_data

# Backup volume
docker run --rm -v nutricheck_mongodb_data:/data \
  -v $(pwd):/backup alpine tar czf /backup/mongodb.tar.gz /data
```

## Production Deployment

For production deployment, see detailed guides:

- **Docker Validation**: [DOCKER_VALIDATION.md](DOCKER_VALIDATION.md)
  - Step-by-step validation procedures
  - Health check endpoints
  - Troubleshooting guide
  
- **Deployment Flow**: [DEPLOYMENT_FLOW.md](DEPLOYMENT_FLOW.md)
  - Complete deployment pipeline
  - Cloud platform integration (AWS, Azure)
  - Kubernetes manifests
  - CI/CD integration
  - Scaling strategies

- **Jenkins CI/CD**: [JENKINS_CICD.md](JENKINS_CICD.md)
  - Automated build and deployment
  - Security scanning
  - Production deployment pipeline

## Best Practices

### Development

✅ Use `docker-compose up -d` for local testing
✅ Mount source code volumes for live reload
✅ Use `.dockerignore` to exclude unnecessary files
✅ Keep images small with multi-stage builds
✅ Document environment variables

### Production

✅ Always specify image tags (never use `latest`)
✅ Use secrets management (AWS Secrets Manager, Azure Key Vault)
✅ Enable container security scanning
✅ Implement health checks and readiness probes
✅ Use managed databases instead of containers
✅ Enable logging and monitoring
✅ Use private container registries
✅ Implement auto-scaling policies

## Docker Compose File Structure

```yaml
version: '3.9'                    # Compose version

services:                         # Service definitions
  mongodb:                        # Database service
  backend:                        # API service
  frontend:                       # Web frontend service

volumes:                          # Named volumes for persistence
  mongodb_data:

networks:                         # Custom networks
  default:                        # Default network
```

## Performance Tips

1. **Layer Caching**: Order Dockerfile commands to maximize caching
2. **Multi-stage Builds**: Frontend uses multi-stage to reduce image size
3. **Alpine Base Images**: Small lightweight base images
4. **Production Builds**: Use `npm install --omit=dev` for backend
5. **Nginx Optimization**: Gzip compression, browser caching

## Security Considerations

⚠️ **Important**: The current setup is suitable for **development only**

For **production**, address:

1. **Secrets Management**
   - Move sensitive credentials to environment variables or secret managers
   - Never commit secrets to repository
   - Use Docker Secrets or cloud provider secret management

2. **Image Scanning**
   - Scan images for vulnerabilities
   - Use private container registries
   - Keep base images updated

3. **Network Security**
   - Implement network policies
   - Use HTTPS/TLS
   - Configure firewall rules
   - Implement API rate limiting

4. **Database Security**
   - Enable MongoDB authentication
   - Use encrypted connections
   - Implement access control
   - Regular backups

## Monitoring & Logging

### Container Metrics

```bash
# Monitor container resource usage
docker stats
```

### Centralized Logging

Configure log drivers for centralized log aggregation:

```yaml
logging:
  driver: "splunk"
  options:
    splunk-token: "${SPLUNK_TOKEN}"
    splunk-url: "https://your-splunk-instance:8088"
```

## Related Documentation

- [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) - System architecture
- [DEPLOYMENT_FLOW.md](DEPLOYMENT_FLOW.md) - Complete deployment pipeline
- [DOCKER_VALIDATION.md](DOCKER_VALIDATION.md) - Validation procedures
- [JENKINS_CICD.md](JENKINS_CICD.md) - CI/CD pipeline
- [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) - Setup instructions

## Next Steps

1. **Validate locally**: Follow [DOCKER_VALIDATION.md](DOCKER_VALIDATION.md)
2. **Set up CI/CD**: Configure Jenkins pipeline from [JENKINS_CICD.md](JENKINS_CICD.md)
3. **Deploy to cloud**: Use guides in [DEPLOYMENT_FLOW.md](DEPLOYMENT_FLOW.md)
4. **Production hardening**: Address security considerations above
5. **Monitor**: Set up logging and monitoring stack

## References

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/dev-best-practices/dockerfile-best-practices/)
- [Nginx Official Image](https://hub.docker.com/_/nginx)
- [MongoDB Official Image](https://hub.docker.com/_/mongo)
- [Node.js Official Image](https://hub.docker.com/_/node)

## Support

For issues or questions:
1. Check the [DOCKER_VALIDATION.md](DOCKER_VALIDATION.md) troubleshooting section
2. Review container logs: `docker-compose logs`
3. Check [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) for system overview
4. Consult [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details

---

**Last Updated**: August 17, 2026  
**Status**: ✅ Fully Validated and Operational  
**Version**: 1.0.0
