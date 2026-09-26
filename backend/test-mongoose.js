const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  faceDescriptor: [Number]
});
const User = mongoose.model('TestUser', userSchema);

const faceDistance = (first, second) => Math.sqrt(
  first.reduce((total, value, index) => total + ((value - second[index]) ** 2), 0)
);

const run = async () => {
  const u = new User({ faceDescriptor: Array(128).fill(0.1) });
  const first = u.faceDescriptor;
  const second = Array(128).fill(0.2);

  console.log('first.length', first.length);
  
  const dist = faceDistance(first, second);
  console.log('Distance:', dist);
  
  // expected: sqrt(128 * (0.1 - 0.2)^2) = sqrt(128 * 0.01) = sqrt(1.28) ~ 1.131
  
  process.exit(0);
};

run().catch(console.log);
