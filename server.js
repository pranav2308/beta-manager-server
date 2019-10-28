const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

app.listen( 3000, () => {console.log(`Listening to request on port 3000!`)});