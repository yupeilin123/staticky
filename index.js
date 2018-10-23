const http = require('http');
const os = require('os');
const Koa = require('koa');
const compress = require('koa-compress');
const serveStatic = require('koa-static');
const serveList = require('koa-serve-list');
const chalk = require('chalk');
const opn = require('opn');
const chokidar = require('chokidar');
const socketIo = require('socket.io');
const showdown = require('showdown');
const { wrapHtml, socketSctipt, codeStyle, markdownWrapDiv } = require('./template');

const converter = new showdown.Converter();
class staticky {
  static create(options = {}) {
    return Promise.resolve(new staticky(options));
  }
  constructor(options) {
    const {
      port,
      openBrowser,
      rootDir,
      openGizp,
      targetFile,
      reload,
      ipAddress = this.getIPAddress()
    } = options;
    this.app = new Koa();
    this.app.use(async (ctx, next) => {
      ctx.set('Access-Control-Allow-Origin', '*');
      await next();
    });
    this.app.use(this.onReload());
    this.app.use(serveStatic(rootDir, {
      index: targetFile
    }));
    this.app.use(serveList(rootDir, {
      'icons': true
    }));
    // enable compress
    if (openGizp) {
      this.openGizp();
    }
    const server = http.createServer(this.app.callback());
    // start http server
    this.listen(server, {
      port,
      openBrowser,
      ipAddress
    });
    // start io connect httpServer
    const io = socketIo.listen(server);
    // watch file or dir
    chokidar.watch(reload, {
      ignored: /node_modules/
    }).on('change', () => {
      io.emit('reload');
    });
  }
  /**
   * 
   * @param {httpServer} server 
   * @param {String<port>, Boolean<openBrowser>, String<ipAddress>} options
   */
  listen(server, { port, openBrowser, ipAddress }) {
    server.listen(port, () => {
      console.log(chalk.green.reset(`Local:           http://localhost:${port}/`));
      console.log(chalk.green.reset(`On Your NetWork: http://${ipAddress}:${port}/`));
      // open Browser
      if (openBrowser) {
        this.openBrowser(port);
      }
    });
  }
  // use koa-compress to start gzip
  openGizp() {
    this.app.use(compress({
      threshold: 2024,
      flush: require('zlib').Z_SYNC_FLUSH
    }));
  }
  /**
   * 
   * @param {string} port 
   */
  openBrowser(port) {
    opn(`http://localhost:${port}/`);
  }
  // inject html or script to ctx.body
  onReload() {
    return async (ctx, next) => {
      let chunks = '';
      await next();
      if (ctx.type !== 'application/pdf') {
        const injectHtml = await new Promise((resolve) => {
          ctx.body.on('data', chunk => {
            chunks += chunk;
          });
          ctx.body.on('end', () => {
            let val;
            if (ctx.type === 'text/html') {
              val = chunks.replace('</head>', body => {
                return socketSctipt + body;
              });
            } else if (ctx.type === 'text/markdown') {
              const conversionHtml = converter.makeHtml(chunks);
              const markdownHtml = markdownWrapDiv.replace('markdown', conversionHtml);
              val = wrapHtml.replace('</body>', body => {
                return markdownHtml + body;
              }).replace('</head>', body => {
                return codeStyle + body;
              })
            } else {
              val = wrapHtml.replace('</body>', body => {
                return `<pre style="word-wrap: break-word; white-space: pre-wrap;">${chunks}</pre>` + body;
              });
            }
            resolve(val);
          })
        })
        ctx.set('Content-Type', 'text/html; charset=utf-8');
        ctx.body = injectHtml;
      }
    }
  }
  /**
  * @return {string} ip
  */
  getIPAddress() {
    const netIps = os.networkInterfaces();
    let ip = '';
    for (const key in netIps) {
      netIps[key].forEach(detail => {
        if (ip === '' && detail.family === 'IPv4' && !detail.internal) {
          ip = detail.address;
          return;
        }
      })
    }
    return ip || '127.0.0.1';
  }
}

module.exports = staticky;