/**
 * 用node原生代码实现静态资源服务器的功能，类似于 express.static() 方法的功能。
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
const zlib = require('zlib');
const mime = require('./mime');

const server = http.createServer((req, res) => {
    // 请求的资源路径
    const requestPath = url.parse(req.url).pathname;

    // 获取文件名的后缀，从而得到文件的mine值，设置响应头的content-type。由于extname返回值包含”.”，所以通过slice方法来剔除掉”.”, 对于没有后缀名的文件，我们一律认为是unknown。
    let ext = path.extname(requestPath);
    ext = ext ? ext.slice(1) : 'unknow';
    //未知的类型一律用"text/plain"类型
    const contentType = mime[ext] || 'text/plain';

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
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-length', stat.size);
            let stream = fs.createReadStream(filePath);

            // 使用 zlib 进行压缩
            const acceptEncoding = req.headers['accept-encoding'] || '';
            const matched = ext.match(/css|js|html/ig);
            if (matched && acceptEncoding.match(/\bgzip\b/)) {
                res.setHeader('Content-Encoding', 'gzib');
                stream.pipe(zlib.createGzip()).pipe(res);
            } else if (matched && acceptEncoding.match(/\bdeflate\b/)){
                res.setHeader('Content-Encoding', 'deflate');
                stream.pipe(zlib.createDeflate()).pipe(res);
            } else {
                stream.pipe(res);
            }

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
