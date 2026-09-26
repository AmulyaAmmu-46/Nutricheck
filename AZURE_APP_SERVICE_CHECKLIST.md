# Azure App Service Deployment Checklist

This project can keep its existing local development setup while deploying the Express API to Azure App Service (Linux) and the React frontend as a separate static site or frontend App Service.

## Changes made

- Kept the backend port expression as `process.env.PORT || 5001`; Azure supplies `PORT`, while local development still defaults to port 5001.
- Changed MongoDB startup to require `MONGODB_URI` instead of silently connecting to a hardcoded local database. `backend/.env.example` supplies the local MongoDB URI for development.
- Replaced permissive CORS with an allowlist from `CORS_ORIGINS` or `FRONTEND_URL`. Comma-separated origins are supported. Requests without an `Origin` header, such as health probes, remain allowed.
- Kept the frontend's local-only API fallback for local browser sessions. Azure builds use `REACT_APP_API_URL`, with no production hostname embedded in source.
- Added an explicit `start:azure` command. Azure can use `npm run start:azure`; the standard `npm start` command remains supported.
- Confirmed the root `.gitignore` already excludes `node_modules`, `.env` files, and `build` output, so it did not need modification.
- Added backend and frontend `.env.example` files for local configuration. Copy these to `.env` in the corresponding folder for local use; never deploy real secrets in these files.
- Updated root diagnostic scripts to read API/database targets from `API_BASE_URL` and `MONGODB_URI` in the backend environment instead of embedding localhost addresses.
- Reviewed backend relative imports for Linux case sensitivity; the imported filenames match their checked-in casing.

## Backend App Service

- [ ] Create an Azure App Service using **Linux** and a supported Node.js runtime (Node 18 or newer, matching `backend/package.json`).
- [ ] Deploy the contents of `backend/` as the application root, including `package.json` and its lockfile.
- [ ] Use `npm start` or `npm run start:azure` as the startup command.
- [ ] Set App Service application settings: `MONGODB_URI`, `JWT_SECRET`, and any email settings required by your deployment (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`).
- [ ] Set `CORS_ORIGINS` to the exact frontend origin, or use `FRONTEND_URL` for a single origin. For multiple origins, separate them with commas. Do not include a trailing slash.
- [ ] Set `NODE_ENV=production`. Do not manually set `PORT`; allow App Service to provide it.
- [ ] Configure health monitoring to request `/health`.
- [ ] Ensure your MongoDB service permits network access from the App Service and uses TLS where appropriate.

## Frontend Deployment

- [ ] Build `frontend/` with `REACT_APP_API_URL` set to the deployed backend API base URL, ending in `/api` only if the frontend calls expect that prefix. In this project, configure the backend base URL without `/api` because endpoint paths already include it.
- [ ] Build after setting the variable: React embeds `REACT_APP_*` values at build time; changing an App Service setting after deployment does not rewrite an existing build.
- [ ] Deploy the contents of `frontend/build/` to the chosen static host or frontend App Service.
- [ ] Add SPA fallback/rewrite behavior to serve `index.html` for client-side routes.
- [ ] Set the backend `CORS_ORIGINS` or `FRONTEND_URL` to the frontend's exact HTTPS origin.

## Local Verification

- [ ] Copy `backend/.env.example` to `backend/.env` and set local secrets as needed.
- [ ] Copy `frontend/.env.example` to `frontend/.env` for an explicit local API URL; the existing localhost fallback also remains available for local browser sessions.
- [ ] Start local MongoDB, then run `npm run dev` from `backend/` and `npm start` from `frontend/`.
- [ ] Verify `http://localhost:5001/health` and the frontend login/register flows.

## Notes

- Azure deployment recommendations: use App Service application settings for secrets and environment-specific values, enable HTTPS-only, deploy the backend from its own root, and deploy the React production build separately.
- Do not put a real Azure URL, database credential, or JWT secret in source control. `REACT_APP_API_URL` is public client-side configuration, not a place for secrets.
- The root ignore rules already cover the requested generated files and secrets; verify generated build artifacts are not force-added to Git.