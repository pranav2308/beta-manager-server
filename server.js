const express = require('express');
const app = express();

const registerUser = require('./controllers/Registration/registerUser.js');
const loginUser = require('./controllers/Login/loginUser.js');
const getIVSAllocation = require('./controllers/Strategies/IVS/getIVSAllocation');
const getMarkowitzAllocation = require('./controllers/Strategies/Markowitz/getMarkowitzAllocation');

const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const spawn = require("child_process").spawn;

var knex = require('knex')

const database = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  	ssl: true
  }
});

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Successful Deployment!');
});
app.post('/register', registerUser(bcrypt, database));

app.post('/login', loginUser(bcrypt, database));

app.post('/IVS', getIVSAllocation(spawn, database));

app.post('/Markowitz', getMarkowitzAllocation(spawn, database));



const port  = process.env.PORT || 3000;

app.listen( port, () => {console.log(`Listening to request on port ${port}!`)});