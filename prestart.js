const { execSync } = require('child_process');
try {
  require.resolve('vite');
} catch (err) {
  console.log('Dependencies missing. Installing...');
  execSync('npm install', { stdio: 'inherit' });
}
