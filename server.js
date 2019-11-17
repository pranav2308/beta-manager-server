const express = require('express');
const app = express();

const registerUser = require('./controllers/Registration/registerUser.js');


const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

var knex = require('knex')

const database = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'pranav2308',
    database : 'beta_manager'
  }
});

app.use(cors());
app.use(bodyParser.json());

app.post('/register', registerUser(bcrypt, database));

app.listen( 3000, () => {console.log(`Listening to request on port 3000!`)});