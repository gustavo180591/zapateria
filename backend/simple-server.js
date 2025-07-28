const express = require('express');
const cors = require('cors');

// Import our controller
const { HelloController } = require('./src/api/controllers/hello.controller');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const helloController = new HelloController();
app.get('/api/hello', (req, res) => helloController.getHello(req, res));

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Test endpoint: http://localhost:${port}/api/hello`);
});
