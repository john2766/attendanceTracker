const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors())

require('./services/classServices')
const MainRouter = require('./routes/index')
const Service = require('./services/hardwareServices')

app.use('/services', Service)
app.use('/', MainRouter)

// TODO: Add authentication

// Listen for requests
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});