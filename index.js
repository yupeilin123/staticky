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
const { statickyWrapHtml, socketIoSctipt, markdownLink, markdownWrapDiv } = require('./template');

const converter = new showdown.Converter();
class Staticky {
  static create(options = {}) {
    return Promise.resolve(new Staticky(options));
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
    // enable compress
    if (openGizp) {
      this.openGizp();
    }
    // liver Reload
    this.app.use(this.reloading());
    this.app.use(serveStatic(rootDir, {
      index: targetFile
    }));
    this.app.use(serveList(rootDir, {
      'icons': true
    }));
    const server = http.createServer(this.app.callback());
    // start io connect httpServer
    const io = socketIo.listen(server,{
      // transports: ['websocket']
    });
    // start http server
    this.listen(server, {
      port,
      openBrowser,
      ipAddress
    });
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
      console.log(chalk.bold.greenBright(`Local:           http://localhost:${port}/`));
      console.log(chalk.bold.greenBright(`On Your NetWork: http://${ipAddress}:${port}/`));
      // open Browser
      if (openBrowser) {
        this.openBrowser(port);
      }
    });
  }
  // use koa-compress to start gzip
  openGizp() {
    this.app.use(compress({
      filter: function (contentType) {
        return /^text/.test(contentType)
      },
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
  reloading() {
    return async (ctx, next) => {
      let chunks = '';
      await next();
      if (this.isContentTypeRight(ctx.type)) {
        const injectHtml = await new Promise((resolve) => {
          ctx.body.on('data', chunk => {
            chunks += chunk;
          });
          ctx.body.on('end', () => {
            let val;
            if (ctx.type === 'text/html') {
              val = chunks.replace('</head>', body => {
                return socketIoSctipt + body;
              });
            } else if (ctx.type === 'text/markdown') {
              const conversionHtml = converter.makeHtml(chunks);
              const markdownHtml = markdownWrapDiv.replace('markdown', conversionHtml);
              val = statickyWrapHtml.replace('</body>', body => {
                return `<article class="markdown-body">${markdownHtml}</article>` + body;
              }).replace('</head>', body => {
                return markdownLink + body;
              })
            } else {
              val = statickyWrapHtml.replace('</body>', body => {
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
   * 
   * @param {String} contentType
   * @returns {Boolean}
   */
  isContentTypeRight(contentType) {
    const otherType = ['application/javascript', 'application/ecmascript', 'application/json'];
    return /^text/.test(contentType) || otherType.some(_ => _ === contentType);
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

module.exports = Staticky;