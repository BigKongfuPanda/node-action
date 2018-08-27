/**
 * 实现表单提交和文件上传功能
 * 1. 访问localhost:3000 时，返回 html 表单
 * 2. 提交表单后，监听文件上传进度，文件上传之后，解析表单和文件，并将上传后的文件放在 uploads 文件夹中。
 * 3. 上传功能借助于 formidable 插件, https://www.npmjs.com/package/formidable。
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const server = http.createServer((req, res) => {
  switch (req.method.toLowerCase()) {
    case 'get':
      show(req, res);
      break;
    case 'post':
      upload(req, res);
      break;
    default:
      break;
  }
});

const show = (req, res) => {
  let html = fs.readFileSync('./form.html');
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
};

const upload = (req, res) => {
  if (isFormData(req)) {
    res.statusCode = 400;
    res.end('Bad request: excepting multipart/form-data');
    return;
  }

  const form = new formidable.IncomingForm();
  
  // 设置上传后文件所存放的文件夹
  form.uploadDir = path.join(__dirname, '/uploads');

  // 上传进度
  form.on('progress', (bytesReceived, bytesExpected) => {
    let percent = Math.floor(bytesReceived / bytesExpected * 100);
    console.log(percent);
  });
  
  // 解析上传后的表单和文件
  form.parse(req, (error, fields, files) => {
    console.log(error);
    console.log(fields);
    console.log(files);
    console.log(files.file.name);
    console.log('upload completed');
    fs.rename(files.file.path, __dirname + '/uploads/' + files.file.name, (error) => {
      console.log(error);
    });
  });
};

const isFormData = (req) => {
  let ContentType = req.headers['Content-Type'] || '';
  return ContentType.toLowerCase() === 'multipart/form-data';
};

server.listen(3000);

console.log('Sever is running on localhost:3000');