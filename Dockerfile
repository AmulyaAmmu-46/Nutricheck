# syntax=docker/dockerfile:1

FROM node:18-alpine AS base
WORKDIR /app

FROM base AS backend
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend ./
EXPOSE 5001
CMD ["node", "server.js"]
