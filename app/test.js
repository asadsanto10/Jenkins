const http = require('http');
const server = require('./server');

const PORT = 3001;
let passed = 0;
let failed = 0;

function test(name, url, expected) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${PORT}${url}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const body = JSON.parse(data);
        if (res.statusCode === expected.status && body.message === expected.message) {
          console.log(`  PASS: ${name}`);
          passed++;
        } else {
          console.log(`  FAIL: ${name}`);
          console.log(`    Expected status ${expected.status}, got ${res.statusCode}`);
          failed++;
        }
        resolve();
      });
    });
  });
}

async function runTests() {
  const testServer = server.listen(PORT, async () => {
    console.log('Running tests...\n');

    await test(
      'GET / returns hello message',
      '/',
      { status: 200, message: 'Hello from Node.js!' }
    );

    await test(
      'GET /health returns healthy',
      '/health',
      { status: 200, message: undefined }
    );

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    testServer.close();
    process.exit(failed > 0 ? 1 : 0);
  });
}

runTests();
