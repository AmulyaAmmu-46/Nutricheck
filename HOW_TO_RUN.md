# How to Run Nuricheck - Step by Step

Follow these steps to run the project on your machine.

## Prerequisites Check

First, make sure you have these installed:
- Node.js (v14 or higher)
- MongoDB
- npm (comes with Node.js)

## Step 1: Install Dependencies

### Install Backend Dependencies

Open terminal/command prompt and run:

```bash
cd backend
npm install
```

Wait for installation to complete. You should see a `node_modules` folder created.

### Install Frontend Dependencies

Open a **new terminal window** and run:

```bash
cd frontend
npm install
```

Wait for installation to complete.

## Step 2: Set Up Environment Variables

### Backend Environment Setup

1. Navigate to `backend` folder`
2. Create a file named `.env` (not `.env.example`)
3. Copy this content into `.env`:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nutricheck
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=nuricheck@example.com
```

**Important Notes:**
- For `MONGODB_URI`: If MongoDB is on a different port, change `27017`
- For `JWT_SECRET`: Use any random string (at least 32 characters)
- For Email: If you don't have email setup, you can use dummy values (emails won't send but app will work)

### Frontend Environment Setup

1. Navigate to `frontend` folder
2. Create a file named `.env`
3. Add this content:

```env
REACT_APP_API_URL=http://localhost:5001
```

## Step 3: Start MongoDB

### Windows:
```bash
net start MongoDB
```

Or if MongoDB is installed as a service, it might already be running.

### macOS:
```bash
brew services start mongodb-community
```

Or:
```bash
mongod
```

### Linux:
```bash
sudo systemctl start mongod
```

**Verify MongoDB is running:**
- Try connecting: `mongosh` or `mongo`
- If it connects, MongoDB is running ✅

## Step 4: Start Backend Server

In the terminal, navigate to backend folder:

```bash
cd backend
npm run dev
```

**You should see:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
```

**Keep this terminal open!**

## Step 5: Start Frontend Server

Open a **NEW terminal window** (keep backend running):

```bash
cd frontend
npm start
```

**You should see:**
```
Compiled successfully!

You can now view nuricheck-frontend in the browser.

  Local:            http://localhost:3000
```

The browser should automatically open to `http://localhost:3000`

## Step 6: Test the Application

1. **Register a new user:**
   - Click "Register here" or go to Register page
   - Fill in: Username, Email, Phone, Password
   - Click Register
   - **Note the OTP** shown in the response (for demo purposes)

2. **Verify OTP:**
   - Enter the 6-digit OTP
   - Click "Verify OTP"

3. **Login:**
   - Enter your email and password
   - Click "Sign in"

4. **Create Profile:**
   - Enter Height (cm), Weight (kg)
   - Select Health Conditions (optional)
   - Select Goal (Bulking/Leaning/Maintaining Health)
   - Click "Save Profile"

5. **Add Food:**
   - Click "Add Food" button
   - Enter meals like: "2 eggs, 100g chicken breast"
   - Click "Save Meals"
   - Check your email for notification (if email is configured)

## Quick Commands Summary

```bash
# Terminal 1 - Backend
cd backend
npm install          # First time only
npm run dev          # Start backend

# Terminal 2 - Frontend  
cd frontend
npm install          # First time only
npm start            # Start frontend

# Terminal 3 - MongoDB (if needed)
mongod               # Start MongoDB
```

## Troubleshooting

### Problem: MongoDB connection error

**Solution:**
- Make sure MongoDB is running
- Check `MONGODB_URI` in `backend/.env`
- Try: `mongosh` to test connection

### Problem: Port 5000 already in use

**Solution:**
- Change `PORT=5000` to `PORT=5001` in `backend/.env`
- Update `REACT_APP_API_URL=http://localhost:5001` in `frontend/.env`
- Restart both servers

### Problem: Frontend can't connect to backend

**Solution:**
- Make sure backend is running on port 5000
- Check `REACT_APP_API_URL` in `frontend/.env` matches backend port
- Check browser console for errors

### Problem: Module not found errors

**Solution:**
```bash
# Delete node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Problem: Email not sending

**Solution:**
- This won't break the app - food entry still works
- To fix: Set up Gmail App Password (see INSTALLATION_GUIDE.md)
- Or use dummy values - app will work without emails

## What You Should See

### Backend Terminal:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
```

### Frontend Terminal:
```
Compiled successfully!
webpack compiled with 0 warnings
```

### Browser:
- Login/Register page at `http://localhost:3000`

## Next Steps

Once running:
1. Register a test user
2. Create a profile
3. Add some food entries
4. Check the dashboard for protein tracking

## Need Help?

- Check `INSTALLATION_GUIDE.md` for detailed setup
- Check `API_DOCUMENTATION.md` for API details
- Check console logs for errors
- Verify all `.env` files are created correctly

---

**That's it! Your Nuricheck app should now be running! 🚀**



