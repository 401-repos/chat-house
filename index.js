'use strict';

require('dotenv').config();
const { run } = require('./src/server');
const PORT = process.env.PORT;

run(PORT);