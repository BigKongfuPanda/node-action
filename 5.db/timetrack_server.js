const http = require('http');
const mysql = require('mysql');
const work = require('./lib/timetrack');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'myuser',
    password: 'mypassword',
    database: 'timetrack'
});

