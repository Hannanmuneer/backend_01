
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const adminmodel = require('./adminschema');

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';

    const existingAdmin = await adminmodel.findOne({
      email: adminEmail
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await adminmodel.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });

      console.log('Default admin account created');
    } else {
      console.log('Default admin already exists');
    }
  } catch (err) {
    console.error('Admin creation error:', err);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    await createDefaultAdmin();
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
