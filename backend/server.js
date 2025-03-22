const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 5000;

app.use(morgan('dev')); // Log requests to the console in "dev" format

app.get('/api/data', (req, res) => {
  res.json({ message: 'Data from the backend' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});