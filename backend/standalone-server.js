const http = require('http');

class HelloController {
  getHello(req, res) {
    res.setHeader('Content-Type', 'application/json');
    // Only send the response once
    if (!res.headersSent) {
      res.end(JSON.stringify({ message: '¡Hola desde el backend de Zapateria!' }));
    }
  }
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route requests
  if (req.url === '/api/hello' && req.method === 'GET') {
    const controller = new HelloController();
    controller.getHello(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/hello`);
});