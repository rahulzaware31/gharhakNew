const { spawn } = require('child_process');

function run(name, cmd, args) {
  const child = spawn(cmd, args, { stdio: 'inherit', shell: true });
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`${name} exited with code ${code}`);
    }
    process.exit(code || 0);
  });
  return child;
}

const api = run('API', 'node', ['server-api.js']);
const app = run('APP', 'react-scripts', ['start']);

function shutdown() {
  if (api && !api.killed) api.kill('SIGTERM');
  if (app && !app.killed) app.kill('SIGTERM');
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
