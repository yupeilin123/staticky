#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const path = require('path');
const StatickyError = require('../Errors');
const Staticky = require('..');

const convert = {
  port: function (num) {
    return parseInt(num, 10);
  },
  dir: function (workPath) {
    return path.resolve(process.cwd(), workPath);
  }
};

program
  .version('0.3.2', '-v, --version')
  .option('-p, --port <port>', 'server\'s listen port, 8091 default', convert.port)
  .option('-n, --no-browser', 'don\'t open browser, default open browser')
  .option('-t, --target <file>', 'which the file open', 'index.html')
  .option('-d, --dir <path>', 'working dir, default process.cwd()', convert.dir)
  .option('-g, --gzip', 'the request accepts gzip encoding')
  .option('--no-reload', 'live reloaded, default opened，watching process.cwd()')
  .parse(process.argv);

const rootDir = program.dir || process.cwd();

// judge dir is Directory
fs.stat(rootDir, (err, stats) => {
  if (err) throw new StatickyError(err);
  if (stats.isDirectory()) {
    const option = {
      port: program.port || 8091,
      openBrowser: program.browser,
      rootDir: rootDir,
      openGizp: program.gzip || false,
      targetFile: program.target,
      openReload: program.reload
    };
    Staticky.create(option);
  } else {
    throw new StatickyError('dir is not directory');
  }
});
