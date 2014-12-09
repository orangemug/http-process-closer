# http-process-closer
Start a process that can close itself via a http endpoint. **Windows only!!!**


## Usage
It has no deps except [nodejs](http://nodejs.org/) so its really easy to use, just call

    ./http-process-closer.js /Applications/Firefox.app/Contents/MacOS/firefox-bin example/index.html

That'll expose a route at <http://localhost:9347/close> that'll kill the process.

You can also compile a windows **exe** (if you need to run it on a usb pen drive for example), Just install <https://github.com/crcn/nexe> and run

    nexe -i http-process-closer.js -o http-process-closer.exe

(**NOTE:** It'll be slow the first time)

## License
MIT
