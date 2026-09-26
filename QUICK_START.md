# Nuricheck Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need v14+)
node --version

# Check MongoDB
mongod --version
```

## Quick Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment

**Backend `.env` file:**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/nutricheck
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=nuricheck@example.com
```

**Frontend `.env` file:**
```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Start MongoDB

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 5. Open Browser

Navigate to: `http://localhost:3000`

## Test User Flow

1. **Register** → Allow camera access and capture your face
2. **Login** → Enter your email and capture the same face
3. **Login** → Use your credentials
4. **Create Profile** → Enter height, weight, goal
5. **Add Food** → Enter meals like "2 eggs, 100g chicken"
6. **Check Email** → Receive protein tracking notification

## Common Commands

```bash
# Check if MongoDB is running
mongo --eval "db.version()"

# Check backend health
curl http://localhost:5000/api/health

# View backend logs
# Check terminal where backend is running

# View frontend logs
# Check terminal where frontend is running
```

## Troubleshooting

**MongoDB not starting?**
- Check if service is installed: `mongod --version`
- Try manual start: `mongod`

**Port already in use?**
- Change `PORT` in backend `.env`
- Update `REACT_APP_API_URL` in frontend `.env`

**Email not working?**
- Use Gmail App Password (not regular password)
- Check email credentials in `.env`
- Email failures don't break the app

**Frontend can't connect?**
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` matches backend port
- Clear browser cache

## Next Steps

- Read full [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- Explore [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) to understand the codebase

---

**That's it! You're ready to use Nuricheck! 🚀**



