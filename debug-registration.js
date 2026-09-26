const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config({ path: './backend/.env' });

const debugRegistration = async () => {
    try {
        console.log('1. Connecting to MongoDB...');
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI must be set before running this script');

        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        console.log('2. checking for existing user...');
        const email = 'test_debug@example.com';
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('User already exists, deleting...');
            await User.deleteOne({ email });
            console.log('Deleted existing test user');
        }

        console.log('3. Attempting to create user...');
        const newUser = await User.create({
            username: 'test_debug_user',
            email: email,
            phone: '1234567890',
            password: 'password123',
            otp: '123456',
            otpExpiry: new Date(Date.now() + 600000)
        });

        console.log('✅ User created successfully:', newUser._id);
        console.log('✅ Registration flow seems to be working at DB level.');

    } catch (error) {
        console.error('❌ DEBUGGING FAILED:');
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

debugRegistration();
