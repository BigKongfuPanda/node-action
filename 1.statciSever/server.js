const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    // 请求的资源路径
    const requestPath = url.parse(req.url).pathname;
    const filePath = requestPath === '/' ? path.join(__dirname, './index.html') : path.join(__dirname, requestPath);

    // 检查文件是否存在
    fs.stat(filePath, (err, stat) => {
        if (err) {
            if ('ENOENT' == err.code) {
                res.statusCode = 400;
                res.end('Not Found');
            } else {
                res.statusCode = 500;
                res.end('Internal Sever Error');
            }
        } else {
            res.setHeader('Content-length', stat.size);
            let stream = fs.createReadStream(filePath);
            stream.pipe(res);
            // 处理错误
            stream.on('error', (err) => {
                res.statusCode = 500;
                res.end('Internal Sever Error');
            });
        }
    });
});

server.listen(3000);

console.log('Sever is running on localhost:3000');
