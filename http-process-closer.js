var http  = require('http');
var spawn = require('child_process').spawn;
var exec  = require('child_process').exec;

var p = spawn(process.argv[2], process.argv.splice(3));
p.stdout.pipe(process.stdout);
p.stderr.pipe(process.stderr);

var server = http.createServer(function (req, res) {
  if (req.url === '/close') {
    exec('taskkill /pid ' + p.pid + ' /T /F', function() {
      res.statusCode = 200;
      res.end();
      process.exit(0);
    });
    return;
  }

  // Can't find
  res.statusCode = 404;
  res.end();
})

var port = process.env.PORT || 9347;
server.listen(port);
