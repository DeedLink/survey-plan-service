require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
