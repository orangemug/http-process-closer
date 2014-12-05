# http-process-closer
Start a process that can close itself


## Usage
It has no deps except [nodejs](http://nodejs.org/) so its really easy to use, just call

    ./http-process-closer.js /Applications/Firefox.app/Contents/MacOS/firefox-bin example/index.html

That'll expose a route at <http://localhost:9347/close> that'll kill the process.


## License
MIT
