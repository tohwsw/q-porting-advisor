const bcrypt = require('bcrypt');
const sass = require('node-sass');

async function main() {
  console.log('Sass version:', sass.info);
  
  const password = 'hello123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Original password:', password);
  console.log('Hashed password:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password verification:', isValid);
}

main().catch(console.error);
