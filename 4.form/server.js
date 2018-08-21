const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

});

server.listen(3000);

console.log('Sever is running on localhost:3000');