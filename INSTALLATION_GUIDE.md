# Nuricheck Installation Guide

This guide will walk you through setting up and running the Nuricheck application step by step.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning)

## Step 1: Verify Prerequisites

### Check Node.js Installation
```bash
node --version
# Should show v14.x.x or higher

npm --version
# Should show version number
```

### Check MongoDB Installation
```bash
mongod --version
# Should show MongoDB version
```

## Step 2: Clone or Download the Project

If you have the project in a repository:
```bash
git clone <repository-url>
cd nuricheck
```

Or extract the project files to a directory named `nuricheck`.

## Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all required packages:
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- nodemailer
- cors
- nodemon (dev dependency)

**Expected output:** Dependencies installed successfully.

## Step 4: Install Frontend Dependencies

Open a new terminal window:

```bash
cd frontend
npm install
```

This will install all required packages:
- react
- react-dom
- react-router-dom
- axios
- react-scripts
- tailwindcss
- autoprefixer
- postcss

**Expected output:** Dependencies installed successfully.

## Step 5: Configure Backend Environment

1. Navigate to the `backend` directory
2. Create a `.env` file (copy from `.env.example` if available)
3. Add the following configuration:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/nutricheck

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=7d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=nuricheck@example.com
```

### MongoDB Configuration

**Option 1: Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/nutricheck
```

**Option 2: MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutricheck?retryWrites=true&w=majority
```

### Email Configuration (Gmail Example)

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords: https://myaccount.google.com/apppasswords
4. Generate an App Password for "Mail"
5. Use that password in `EMAIL_PASS`

**Note:** For other email providers, adjust `EMAIL_HOST` and `EMAIL_PORT` accordingly.

## Step 6: Configure Frontend Environment

1. Navigate to the `frontend` directory
2. Create a `.env` file
3. Add the following:

```env
REACT_APP_API_URL=http://localhost:5000
```

If your backend runs on a different port, update accordingly.

## Step 7: Start MongoDB

### Windows
```bash
# Option 1: Using Windows Service
net start MongoDB

# Option 2: Manual start (if installed as service)
mongod
```

### macOS
```bash
# Using Homebrew
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

### Linux
```bash
# Using systemd
sudo systemctl start mongod

# Or manually
mongod
```

**Verify MongoDB is running:**
```bash
# Should connect successfully
mongo
# or
mongosh
```

## Step 8: Start Backend Server

In the `backend` directory:

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
```

**Troubleshooting:**
- If MongoDB connection fails, ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB is accessible on the specified port

## Step 9: Start Frontend Development Server

Open a **new terminal window** and navigate to the `frontend` directory:

```bash
cd frontend
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view nuricheck-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

The browser should automatically open to `http://localhost:3000`

## Step 10: Verify Installation

### Backend Health Check

Open your browser or use curl:
```bash
curl http://localhost:5001/api/health
```

**Expected response:**
```json
{
  "status": "OK",
   "message": "Nuricheck API is running",
  "timestamp": "..."
}
```

### Frontend Check

1. Navigate to `http://localhost:3000`
2. You should see the login page
3. Try registering a new user

## Step 11: Test the Application

### Complete Flow Test

1. **Register:**
   - Go to Register page
   - Fill in username, email, phone, password
   - Note the OTP displayed in the response

2. **Verify OTP:**
   - Enter the OTP
   - Should redirect to login

3. **Login:**
   - Use registered credentials
   - Should redirect to dashboard

4. **Create Profile:**
   - Enter height, weight, select goal
   - Select health conditions (optional)
   - Save profile

5. **Add Food:**
   - Go to Food Entry page
   - Enter meals (e.g., "2 eggs, 100g chicken")
   - Submit
   - Check email for notification

## Common Issues and Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running
- Check if MongoDB is on the default port (27017)
- Verify `MONGODB_URI` in `.env`

### Issue 2: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

Or change `PORT` in `.env` file.

### Issue 3: Frontend Can't Connect to Backend

**Error:** `Network Error` or `CORS Error`

**Solution:**
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure CORS is enabled in backend (it is by default)

### Issue 4: Email Not Sending

**Error:** Email notification not received

**Solution:**
- Verify email credentials in `.env`
- For Gmail, use App Password (not regular password)
- Check email service logs in backend console
- Email failure doesn't break food entry (it's async)

### Issue 5: Module Not Found Errors

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 6: Tailwind CSS Not Working

**Solution:**
- Ensure `tailwind.config.js` and `postcss.config.js` are in `frontend` directory
- Restart the frontend development server
- Clear browser cache

## Production Deployment

### Backend Production Setup

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET` (32+ characters)
3. Use MongoDB Atlas or secure MongoDB instance
4. Configure proper CORS origins
5. Use process manager (PM2):

```bash
npm install -g pm2
pm2 start server.js --name nuricheck-backend
```

### Frontend Production Build

```bash
cd frontend
npm run build
```

This creates an optimized `build` folder. Deploy this to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

## Development Tips

1. **Use nodemon for backend:** Already configured in `package.json`
2. **Hot reload for frontend:** React Scripts handles this automatically
3. **Check console logs:** Both backend and frontend log useful information
4. **Use browser DevTools:** Check Network tab for API calls
5. **MongoDB Compass:** Use GUI tool to view database

## Next Steps

- Read [README.md](README.md) for project overview
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- Customize email templates in `backend/utils/emailService.js`
- Add more foods to protein dataset in `backend/utils/proteinDataset.js`

## Support

If you encounter issues not covered here:
1. Check console logs (backend and frontend)
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Verify MongoDB is running and accessible

---

**Happy Coding! 🚀**



