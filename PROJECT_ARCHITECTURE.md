# NutriCheck Project Architecture

## Overview

NutriCheck is a personalized nutrition tracking application designed to help users monitor protein intake, maintain fitness goals, and review progress over time. The current application is a working React + Express + MongoDB project that is being upgraded into a professional cloud-native deployment architecture without rewriting the underlying functionality.

## Core Architecture

User
↓
React Frontend
↓
Node.js / Express REST API
↓
Nutrition / Recommendation Logic
↓
MongoDB
↓
Docker
↓
GitHub
↓
Jenkins CI/CD
↓
Azure Container Registry
↓
Kubernetes
↓
Cloud Deployment

## Component Responsibilities

### 1. User
The user interacts with the NutriCheck interface to register, login, create a profile, log meals, and view progress.

### 2. React Frontend
The frontend is built with React, React Router, and Tailwind CSS. It delivers the main UI for:
- landing page
- login and registration
- Camera-based face detection, face descriptor enrollment, and face matching during login
- profile creation
- dashboard
- meal entry form
- report access

### 3. Express REST API
The backend exposes REST APIs for authentication, profile management, food logging, and health monitoring. It handles business logic and communicates with MongoDB.

### 4. Nutrition / Recommendation Logic
The current logic is rule-based and includes:
- protein requirement per goal
- food protein estimation
- consumed vs required tracking
- daily progress summarization

This is preserved and documented as a nutrition tracking engine rather than a machine learning system.

### 5. MongoDB
MongoDB stores users, their profiles, and food tracking data. It remains the database for the current application and keeps the project lightweight.

### 6. Docker
Docker packages the application and supports local development and later deployment. The project uses a lightweight Docker setup with the backend and MongoDB services.

### 7. GitHub
GitHub serves as the repository source of truth for source control and collaboration.

### 8. Jenkins CI/CD
Jenkins automates:
- dependency installation
- automated tests
- Docker image build
- image tagging
- push to ACR
- deployment to Kubernetes

### 9. Azure Container Registry
ACR stores the built application images for deployment. This is the image registry used before Kubernetes pulls the application into the cluster.

### 10. Kubernetes
Kubernetes manages deployment, scaling, service exposure, health checks, and rolling updates for the NutriCheck application.

## CI/CD Pipeline Flow

Developer
↓
GitHub
↓
Jenkins
↓
Automated Tests
↓
Docker Build
↓
Azure Container Registry
↓
Kubernetes Deployment

## Notes

- This architecture keeps the working NutriCheck app intact.
- It does not add unnecessary services or rearchitect the project into a Python or ML-heavy solution.
- The goal is a clean, internship-ready cloud-native deployment model around the existing software.
