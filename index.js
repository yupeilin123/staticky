const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const compress = require('koa-compress');
const serveStatic = require('koa-static');
const serveList = require('koa-serve-list');
const chalk = require('chalk');
const opn = require('opn');
const chokidar = require('chokidar');
const socketIo = require('socket.io');
const showdown = require('showdown');
const { statickyWrapHtml, socketIoSctipt, githubMarkDownCss } = require('./template');

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
      openReload,
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
    // judge resoure existent
    this.app.use(this.resoureExistence(rootDir));
    // liver Reload
    if (openReload) {
      this.app.use(this.reloading());
    }
    this.app.use(serveStatic(rootDir, {
      index: targetFile,
    }));
    this.app.use(serveList(rootDir, {
      'icons': true
    }));
    const server = http.createServer(this.app.callback());

    // start http server
    this.listen(server, {
      port,
      openBrowser,
      ipAddress
    });
    if (openReload) {
      // start io connect httpServer
      const io = socketIo.listen(server);
      // watch file or dir
      chokidar.watch(process.cwd(), {
        ignored: /node_modules/
      }).on('change', () => {
        io.emit('reload');
      }).on('unlink', () => {
        io.emit('reload');
      });
    }
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
  // resoure not Found status 404
  resoureExistence(rootDir) {
    return async (ctx, next) => {
      const fsExist = await new Promise((resolve) => {
        fs.stat(path.join(rootDir, ctx.path), (err) => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        })
      })
      if (fsExist) {
        await next();
      } else {
        ctx.status = 404;
      }
    }
  }
  /**
   * if file type is html or markdown
   * inject script or html
   */
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
            let val = chunks;
            if (ctx.type === 'text/html') {
              val = chunks.replace('</head>', body => {
                return socketIoSctipt + body;
              });
            } else if (ctx.type === 'text/markdown') {
              const markdownHtml = converter.makeHtml(chunks);
              val = statickyWrapHtml.replace('</body>', body => {
                return `<article class="markdown-body">${markdownHtml}</article>` + body;
              }).replace('</head>', body => {
                return githubMarkDownCss + body;
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
    return contentType === 'text/html' || contentType === 'text/markdown';
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