const cluster = require('cluster'),
  http2 = require('http2'),
  config = require('./config');


function conn(i) {

  let client = http2.connect(config.path, config.settings);

    req = client.request({
      ':path': '/',
      ':method': 'get'
    });

    req.setEncoding('utf8');
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      //console.log(`\n${data}`);
      conn(i)
    });

}

if (cluster.isMaster) {

  for (let i = 0; i < config.clusters; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
  });

} else {

  for (let i = 0; i < config.conn; i++) {
    conn(i)
  }

}
