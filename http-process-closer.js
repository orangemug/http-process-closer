var http  = require('http');
var spawn = require('child_process').spawn;
var exec  = require('child_process').exec;
var async = require('async');

var p = []; //spawned process arrays
var routes = {
  close: /^\/close/i,
  spawn: /^\/spawn\/([^?]+)\??(.*)/i
}

function removeProcess(pid) {
  for (var i=0; i<p.length; i++) {
    if (p[i].pid === pid) {
      p.splice(i, 1);
      break;
    }
  }
  if (!p.length) {
    process.exit(0);
  }
}

function spawnNewProcess(path, args) {

  var newProcess = spawn(path, args);

  newProcess.stdout.pipe(process.stdout);
  newProcess.stderr.pipe(process.stderr);

  newProcess.on('exit', function(code, signal) {
      console.log("Process " + newProcess.pid + " quit");
      removeProcess(newProcess.pid);
    });
  newProcess.on('error', function(code, signal) {
      console.log("Process " + newProcess.pid + " failed");
      removeProcess(newProcess.pid);
    });
  p.push(newProcess);
  return newProcess.pid;
}

//start the first process using passed in args
if (spawnNewProcess(process.argv[2], process.argv.splice(3))) {

  var server = http.createServer(function (req, res) {
    if (routes.close.test(req.url)) {
      var tasks = [];
      p.forEach(function (spawnedProcess) {
          tasks.push(function(done) {
             exec('taskkill /pid ' + spawnedProcess.pid + ' /T /F', done);
           });
        });

      res.statusCode = 200;
      res.end();

      async.parallel(tasks,  function() {
          //this should never get called as the process will exit when the last child process dies
          //but here for completeness sake
          process.exit(0);
        });
      return;
    }

    if (routes.spawn.test(req.url)) {
      var params = req.url.match(routes.spawn);
      var path = params[1];
      var args = params[2].split(' ');
      var newProcess = spawnNewProcess(path, args);

      if (newProcess) {
        console.log("Spawned process " + newProcess);
        res.statusCode = 200;
        res.write("Spawned " + path + " " + args);
        res.end();
        return;
      }
    }

    // Can't find route or process
    res.statusCode = 404;
    res.end();
  })

  var port = process.env.PORT || 9347;
  server.listen(port);
  console.log("http process closer listening on port " +port);
} else {
  console.log("Initial process not found");
}