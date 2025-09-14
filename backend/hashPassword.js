const bcrypt = require('bcryptjs');

async function generateHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  console.log('Hashed password:', hashed);
}

// Replace 'Password123!' with your default password
generateHash('Storeowner123!');
