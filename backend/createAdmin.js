const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await mongoose.connection.db.collection('admins').deleteMany({ email: 'admin@news.com' });
    
    await mongoose.connection.db.collection('admins').insertOne({
      email: 'admin@news.com',
      password: hashedPassword
    });
    
    console.log('Admin created successfully!');
    console.log('Email: admin@news.com');
    console.log('Password: admin123');
    mongoose.disconnect();
  })
  .catch(err => console.log(err));