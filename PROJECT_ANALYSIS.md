# NutriCheck: A Cloud-Native Personalized Nutrition Tracking and Recommendation System

## 0. Scope and Constraint

This analysis documents the current repository as it exists today. No application functionality is being rewritten or removed. The current React + Express + MongoDB NutriCheck application is treated as the working foundation to be preserved while adding a cloud-native Docker, CI/CD, Azure ACR, and Kubernetes deployment architecture around it.

## 1. Current Architecture

The existing repository is a full-stack web application built as a MERN-style stack:

- Frontend: React + React Router + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB with Mongoose ODM
- Authentication: JWT-based API authentication with OTP verification flow
- Application style: Personalized nutrition tracking web application with profile management, meal logging, and protein goal monitoring

### High-level structure

- `frontend/` contains the React web app
- `backend/` contains the Express API and MongoDB models
- Root contains documentation and deployment planning assets

### Current runtime flow

1. User opens frontend app in the browser.
2. User registers or logs in via React pages.
3. JWT token is stored in the browser and attached to API requests.
4. Express backend validates the token and handles protected routes.
5. Profile and food entries are stored in MongoDB.
6. Nutrition logic calculates daily protein requirement and food protein contribution.
7. Dashboard summarizes progress and lets the user download a PDF report.

---

## 2. Current NutriCheck Functionality

The current app is primarily a health and nutrition tracking system focused on protein intake.

### Existing features

- User registration with email/phone validation
- OTP-based verification flow
- Login and password reset flow
- User profile creation and update
- Height, weight, disease tags, and goal selection
- Automatic daily protein requirement calculation
- Meal logging for breakfast, lunch, dinner, and snacks
- Protein estimation from food text input
- Daily protein remaining calculation
- Dashboard status tracking
- PDF report generation for meal summary
- Email notification for protein tracking

### User workflow

- Create profile
- Set height, weight, goal
- Log daily meals
- System calculates protein consumed
- System compares it with required protein
- Dashboard shows progress and remaining amount

---

## 3. Existing Nutrition Analysis / Recommendation Logic

### Core nutrition logic

The project uses a rule-based protein recommendation engine instead of a trained ML model.

#### Protein requirement calculation

File: `backend/utils/calculateProtein.js`

The logic calculates daily protein requirement as:

- Bulking: weight × 2
- Leaning: weight × 1.6
- Maintaining Health: weight × 1

This is applied in the profile controller when the user saves/updates profile information.

#### Food protein extraction

File: `backend/utils/proteinDataset.js`

The system uses a built-in dictionary of food items and protein content per 100g, such as:

- chicken
- eggs
- salmon
- tofu
- lentils
- yogurt
- whey protein
- peanut butter
- quinoa
- almonds

The function `extractProteinFromFood()`:

- accepts free-text meal strings
- splits meal entries into food items
- detects quantities such as `100g`, `2 eggs`, `1 cup milk`
- converts quantity to grams when possible
- matches the item against a local protein dataset
- estimates grams of protein consumed
- rounds to one decimal place

### Recommendation logic

There is no advanced ML-based recommendation engine in the current project; recommendations are implicit from the protein tracking workflow and the progress dashboard.

The app currently does the following:

- calculates target protein requirement
- calculates consumed protein
- computes remaining protein
- displays progress status
- emails the user with the remaining goal

This is practical and useful for an internship project, but it is not a true predictive ML system.

---

## 4. Existing ML / Deep Learning Model

### Current status

There is no real ML model, deep-learning model, or trained prediction pipeline in the repository.

### Evidence

- No `model/` directory
- No `requirements` for TensorFlow, PyTorch, scikit-learn, or similar
- No training scripts or model artifact files
- No `predictor.py`, `model_loader.py`, or preprocessing pipeline
- Nutrition logic is deterministic and rule-based

### Interpretation

The current project is a nutrition tracking app, not an ML-powered prediction app. It does not currently implement classification, regression, or recommendation models.

This is important because the internship requirement mentions cloud-native deployment and CI/CD, but the project itself is not an ML-heavy application. The final version should therefore keep the existing nutrition logic and add deployment-quality architecture around it.

---

## 5. Dataset Presence

### Present

The app contains a small built-in dataset for protein values in `backend/utils/proteinDataset.js`.

This is not a large or external nutrition dataset; it is a curated dictionary of common foods and protein-per-100g estimates.

### Not present

- no CSV dataset
- no large database dump
- no external API integration for nutritional analysis
- no model training dataset

---

## 6. Existing Database

The current project uses MongoDB.

### Database usage

- `backend/models/User.js`: user account information
- `backend/models/Profile.js`: height, weight, diseases, goal, protein requirement
- `backend/models/Food.js`: meal entries and daily protein consumed

### MongoDB connection

Connection is configured in `backend/server.js` using:

- `mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nutricheck')`

### Database behavior

- Users are stored in MongoDB
- Profiles are linked to users via `userId`
- Food entries are linked to users by date and `userId`
- Daily logs are queried by date range

This is sufficient for the current app and also suitable as a simple cloud-native backend storage choice for internship deployment.

---

## 7. Existing APIs

The backend exposes these major APIs:

### Authentication routes

- `POST /api/auth/register`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Profile routes

- `POST /api/profile`
- `PUT /api/profile`
- `GET /api/profile`

### Food routes

- `POST /api/food`
- `GET /api/food/today`
- `GET /api/food/history`
- `GET /api/food/report`

### Health route

- `GET /api/health`

This is a simple REST API architecture with Express routers and controller functions.

---

## 8. Existing Templates / Static Files

### Frontend views

The app uses React components/pages rather than server-rendered templates.

Current pages include:

- `frontend/src/pages/Home.js`
- `frontend/src/pages/Login.js`
- `frontend/src/pages/Register.js`
- `frontend/src/pages/OTPVerification.js`
- `frontend/src/pages/ForgotPassword.js`
- `frontend/src/pages/Profile.js`
- `frontend/src/pages/Dashboard.js`
- `frontend/src/pages/FoodEntry.js`

There are no server-side HTML templates or Flask templates in the repository.

### Static assets

- `frontend/public/index.html`
- CSS is handled via Tailwind and `src/index.css`

---

## 9. Existing Authentication

Current authentication approach:

- User registration with password hashing using `bcryptjs`
- JWT token creation using `jsonwebtoken`
- Protected routes protected by `authMiddleware.js`
- OTP verification before allowing login
- Password reset via OTP

### Observations

This is functional and suitable for a student app, but it is not production-grade cloud security. It should be preserved and gradually hardened with environment variables and better secret handling during cloud deployment work.

---

## 10. Existing Dependencies

### Backend dependencies

From `backend/package.json`:

- `express`
- `mongoose`
- `cors`
- `dotenv`
- `bcryptjs`
- `jsonwebtoken`
- `pdfkit`
- `nodemailer`

### Frontend dependencies

From `frontend/package.json`:

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `framer-motion`
- `tailwindcss`
- `react-scripts`

### Key observation

The app is not using Flask, Python, or a Python ML stack. The repository is Node.js-based and should remain so unless a future decision intentionally introduces a Python service. For this internship objective, the simplest path is to keep the working app and add Docker, Jenkins, ACR, and Kubernetes architecture around it.

---

## 11. Current Entry Point

### Backend entry point

- `backend/server.js`

The backend starts an Express app and connects to MongoDB.

### Frontend entry point

- `frontend/src/index.js`

The frontend bootstraps the React app.

---

## 12. Existing Configuration Files

### Root-level files

- `README.md`
- `PROJECT_SUMMARY.md`
- `PROJECT_STRUCTURE.md`
- `API_DOCUMENTATION.md`
- `QUICK_START.md`
- `INSTALLATION_GUIDE.md`
- `HOW_TO_RUN.md`
- `.gitignore`

### Backend config

- `backend/package.json`
- environment variables expected in `.env`

### Frontend config

- `frontend/package.json`
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`

### Observation

There is no Docker configuration, no Jenkinsfile, no Kubernetes manifests, no Python requirements file, and no environment template for cloud deployment.

---

## 13. Existing Secrets / Hard-coded Credentials

### Current state

There are some credential conventions in docs and code patterns:

- JWT secret is expected via `.env`
- MongoDB URI is expected via `MONGODB_URI`
- Email credentials are expected via environment variables

### Risk areas

The app includes environment-driven configuration but does not currently provide a root-level `.env.example` or a secure deployment-ready pattern.

There are also references in documentation showing examples such as email credentials and JWT secret strings, which should not be committed in real projects.

### Hard-coded runtime values found

- MongoDB default local URI is hard-coded in `backend/server.js`
- The app loads environment variables but still falls back to a local URI
- Email settings are environment-based but may be set in `.env` for local development

This is manageable and not severe, but it needs cleanup for cloud deployment.

---

## 14. Files That Can Be Reused

These files are strong candidates for reuse without rewriting the app:

- `backend/server.js`
- `backend/routes/*.js`
- `backend/controllers/*.js`
- `backend/models/*.js`
- `backend/utils/calculateProtein.js`
- `backend/utils/proteinDataset.js`
- `backend/middleware/authMiddleware.js`
- `frontend/src/pages/*.js`
- `frontend/src/App.js`
- `frontend/src/utils/api.js`
- `README.md` and project docs as a starting point

These modules already implement the actual core app logic and user flows.

---

## 15. Files That Need Modification

For the cloud-native upgrade, these files need review or updates:

- `backend/server.js` to add a cleaner health route and deployment-friendly initialization
- `backend/controllers/*` for validation and service-layer cleanup
- `backend/package.json` to simplify and align with a deployable runtime
- `frontend/src/utils/api.js` to support updated backend host configuration
- root configuration files for Docker, `.env.example`, `.gitignore`, and deployment docs
- existing README and documentation to reflect the cloud-native internship objective

---

## 16. New Files Required for the Cloud-Native Roadmap

These are recommended for the next phase after approval:

- `PROJECT_ANALYSIS.md` (created here)
- `requirements.txt` (if a Python-based Flask version is chosen)
- `.env.example`
- `.gitignore`
- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml` (optional if simple local container setup is desired)
- `Jenkinsfile`
- `JENKINS_CICD.md`
- `DOCKER.md`
- `KUBERNETES.md`
- `PROJECT_ARCHITECTURE.md`
- `k8s/deployment.yaml`
- `k8s/service.yaml`
- `k8s/configmap.yaml`
- `tests/` directory with pytest tests if switching to Python/Flask

---

## 17. Recommended Final Architecture

Even though the existing project is a Node.js/Express app, the internship requirement explicitly mentions Flask, Docker, Jenkins, ACR, Kubernetes, and cloud deployment. To satisfy that requirement without discarding the current app, the recommended practical path is:

### Recommended approach

- Preserve the current working NutriCheck application as the foundation
- Keep the existing React frontend and Express backend if possible
- Add a deployment-ready architecture around it
- Introduce health endpoints, validation, environment-based config, and containerization
- Add a simple CI/CD pipeline with Jenkins and ACR
- Add Kubernetes manifests for deployment

### Final architecture concept

User
↓
NutriCheck Web Interface (React)
↓
Node.js / Express API
↓
Nutrition Logic Service
↓
MongoDB Database
↓
Docker Container
↓
GitHub Repository
↓
Jenkins CI/CD
↓
Azure Container Registry
↓
Kubernetes Cluster
↓
Cloud deployment

This keeps the project lightweight, preserves the core app, and aligns it with industry internship expectations.

---

## 18. Problems Found in the Current Project

### 1. Current project is not Flask-based

The repository is a Node.js/Express app. If the internship requires Python/Flask specifically, this needs to be either:

- implemented as a parallel Python service, or
- documented as a Node.js-based equivalent app that is repackaged for cloud deployment

### 2. No explicit ML model

The current app is a rule-based nutrition tracker, not an AI/ML recommendation system.

### 3. No Docker setup

There is no `Dockerfile`, `.dockerignore`, or containerization config.

### 4. No CI/CD pipeline

There is no `Jenkinsfile` or deployment pipeline configuration.

### 5. No Kubernetes manifests

The project does not yet include deployment YAML files.

### 6. Environment variable management is incomplete

The app expects environment variables, but there is no secure root-level `.env.example` and no standard deployment config.

### 7. Health endpoint is minimal and not deployment-oriented

There is only `GET /api/health`, not a simple root `/health` endpoint expected by Docker/Kubernetes readiness checks.

### 8. No dedicated service layer

Business logic is embedded inside controllers, which is fine for a small project but not ideal for clean cloud-native deployment and maintainability.

---

## 19. Proposed Changes (Planned After Approval)

The next phase, after approval, would be incremental and low risk:

1. Preserve current app logic and UI
2. Add a clean service layer for nutrition/assessment logic
3. Add a simple `/health` endpoint and deployment-friendly API validation
4. Add a lightweight assessment/history endpoint consistent with the app’s data model
5. Add `.env.example`, `.gitignore`, Dockerfile, and documentation
6. Add Jenkins pipeline and Azure Container Registry guidance
7. Add Kubernetes manifests and architecture documentation
8. Validate the app locally with tests and container build steps

---

## 20. Estimated Complexity

### Current complexity: Low to Medium

This is a small but functional application with:

- a simple database model
- a small set of controllers and routes
- a lightweight frontend UI
- no ML pipeline
- no containerization or cloud deployment yet

### Upgrade complexity: Medium

The upgrade is feasible without rewriting the app. The main effort is around:

- deployment documentation
- Dockerization
- CI/CD configuration
- Kubernetes YAML
- environment validation and health checks
- preserving the app while making it cloud-ready

### Recommended path

A gradual, non-disruptive upgrade is the best strategy.

---

## 21. Final Assessment

NutriCheck is already a working nutrition-tracking system with a clean user flow and relevant healthcare/nutrition domain logic. It is suitable as a student internship project because it has a real use case and clear feature boundaries.

However, the project currently does not yet satisfy the requested cloud-native enterprise pattern because it is not yet containerized, CI/CD-enabled, or Kubernetes-ready.

The correct next move is not to rewrite the app, but to improve its deployment architecture around the existing working functionality.

This fits the requirement: preserve the existing application, keep its nutrition logic intact, and add a clean cloud-native deployment and CI/CD architecture around it.
