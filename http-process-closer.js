var http  = require('http');
var spawn = require('child_process').spawn;
var exec  = require('child_process').exec;
var async = require('async');

var p = []; //spawned process arrays

function spawnNewProcess(path, args) {
  var newProcess = spawn(path, args);
  newProcess.stdout.pipe(process.stdout);
  newProcess.stderr.pipe(process.stderr);
  p.push(newProcess);
}

//start the first process passed in
spawnNewProcess(process.argv[2], process.argv.splice(3));

var server = http.createServer(function (req, res) {
  if (req.url === '/close') {
    var tasks = [];
    p.forEach(function (spawnedProcess) {
        tasks.push(function(done) {
           exec('taskkill /pid ' + spawnedProcess.pid + ' /T /F', done);
         });
      });

    async.parallel(tasks,  function() {
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
