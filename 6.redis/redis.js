const Redis = require('ioredis');
const client = new Redis();
const pub = new Redis();

// sub / pub

// client.subscribe('news', function(err, counts){
//   pub.publish('news', 'hello world');
// });

// client.on('messsage', (chanel, message) => {
//   console.log('chanel: ', chanel);
//   console.log('message: ', message);
// });

client.set('foo', 'bar');
client.get('foo').then(res => {
  console.log(res);
});

