English | [简体中文](./README.zh-CN.md)

# staticky

[![NPM version](https://img.shields.io/npm/v/staticky.svg?style=flat-square)](https://www.npmjs.com/package/staticky)
[![node version](https://img.shields.io/badge/node.js-%3E=_7.6-green.svg?style=flat-square)](http://nodejs.org/download/)
[![Dependency Status](https://img.shields.io/david/yupeilin123/staticky.svg)](https://david-dm.org/yupeilin123/staticky)
[![Downloads](https://img.shields.io/npm/dm/staticky.svg)](https://www.npmjs.com/package/staticky)

staticky is a better and simple static file server.You can use it and you can see static files on your cell phone and computer so easily.And when the file changes, it can automatically refresh the browser.

## How to use 

First use this command `npm install staticky -g` ,

then in your project's directory, you can use `staticky` ,


it can automatically open the `index.html` under this directory,


if `index.html` not exit, so it will display all the files in the directory.

## Usage

Issue the command `staticky` in your project's directory. Alternatively you can add the path to serve as a command line parameter.

Command line parameters:

* `-p` or `--port` Port to use, defaults to 8091
* `-n` or `--no-browser` Whether to open browser automatically 
* `-t` or `--target` Which the file open, defaults to `index.html`
* `-d` or `--dir` Working directory, defaults to `process.cwd()`
* `-f` or `--fallback` Support single page Application
* `-g` or `--gzip` Whether the request accepts gzip encoding
* `-r` or `--reload` File or directory live reloaded, defauls to `target file` , you can only select `target` or `dir`
* `-h` or `--help` Output usage information

**notice**: live reloaded only support text/html or text/markdown.

## Examples

```
staticky -p 8000 // start static file server in port 8000
staticky -n // don't open browser automatically
staticky -t index.js // the index.js file will be opened
staticky -d src //  the src directory under the current directory will be working directory
staticky -g // open gizp encoding
staticky -r dir // all files in the current directory will be monitored.
```

## Contributing

Any type of contribution is welcome, here are some examples of how you may contribute to this project:

- Submit issues to report bugs or ask questions.
- Propose pull requests to improve our code。