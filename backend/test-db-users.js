const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const faceDistance = (first, second) => Math.sqrt(
  first.reduce((total, value, index) => total + ((value - second[index]) ** 2), 0)
);

const run = async () => {
   const mongoUri = process.env.MONGODB_URI;
   if (!mongoUri) throw new Error('MONGODB_URI must be set before running this script');
   await mongoose.connect(mongoUri);

  const users = await User.find().select('+faceDescriptor');
  console.log("Users:", users.length);
  for (const u of users) {
     console.log("User:", u.email, "isVerified:", u.isVerified);
     if (u.faceDescriptor && u.faceDescriptor.length > 0) {
        console.log("Face Descriptor starts with:", u.faceDescriptor.slice(0, 3));
     } else {
        console.log("No face descriptor");
     }
  }

  // Compare distances between all users
  for (let i = 0; i < users.length; i++) {
     for (let j = i + 1; j < users.length; j++) {
        if (users[i].faceDescriptor && users[j].faceDescriptor && users[i].faceDescriptor.length === 128 && users[j].faceDescriptor.length === 128) {
           const dist = faceDistance(users[i].faceDescriptor, users[j].faceDescriptor);
           console.log(`Distance between ${users[i].email} and ${users[j].email} is ${dist}`);
        }
     }
  }
  process.exit(0);
};

run().catch(console.log);
