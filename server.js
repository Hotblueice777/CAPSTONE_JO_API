const express = require('express');
const cors = require("cors");
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

require("dotenv").config();
let port = process.env.PORT || 8080; 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/expenses', expenseRoutes);
app.use('/budget', budgetRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Expense Management API!');
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use, trying another one...`);
    port += 1; 
    app.listen(port, () => {
      console.log(`Server now running on port ${port}`);
    });
  } else {
    throw err;
  }
});

module.exports = app;
