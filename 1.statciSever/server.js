/**
 * 梳理下功能：
 * 在本地根据指定端口启动一个http server，等待着来自客户端的请求
 * 当请求抵达时，根据请求的url，以设置的静态文件目录为base，映射得到文件位置
 * 检查文件是否存在
 * 如果文件不存在，返回404状态码，发送not found页面到客户端
 * 如果文件存在：打开文件待读取，设置response header，发送文件到客户端
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mime = require('./mime');

const server = http.createServer((req, res) => {
    // 请求的资源路径
    const requestPath = url.parse(req.url).pathname;
    // 默认访问首页 index.html
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
