const faceDistance = (first, second) => Math.sqrt(
  first.reduce((total, value, index) => total + ((value - second[index]) ** 2), 0)
);

// Simulate Mongoose Array
const arr = [1, 2, 3];
arr.isMongooseArray = true;
// Object.assign(arr, { someProp: 'test' });

const dist = faceDistance(arr, [1, 2, 3]);
console.log("Distance:", dist);

const emptyArr = [];
const emptyDist = faceDistance(emptyArr, [1,2,3,4,5]);
console.log("Empty array distance:", emptyDist);
