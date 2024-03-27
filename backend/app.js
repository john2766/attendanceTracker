const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors())

// Import the main router file (index.js)
const mainRouter = require('./routes/index');

// Use the main router in your Express application
app.use('/', mainRouter);

// Additional middleware and configuration can be added here

// Listen for requests
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});