const mongoose = require('mongoose');
const User = require('./backend/models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const faceDistance = (first, second) => Math.sqrt(
  first.reduce((total, value, index) => total + ((value - second[index]) ** 2), 0)
);

const run = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI must be set in the environment or backend/.env');
  await mongoose.connect(mongoUri);

  const users = await User.find().select('+faceDescriptor');
  console.log("Users count:", users.length);
  if (users.length > 0 && users[0].faceDescriptor) {
    const fd = users[0].faceDescriptor;
    console.log("Is array?", Array.isArray(fd));
    console.log("Type of fd[0]", typeof fd[0]);
    console.log("Type of fd", typeof fd);
    
    // Test the reduce
    const dummy = Array(128).fill(0.5);
    const dist = faceDistance(fd, dummy);
    console.log("Distance:", dist);
  } else {
    console.log("No user with faceDescriptor found.");
  }

  process.exit(0);
};

run().catch(console.log);
