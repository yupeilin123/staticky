const githubMarkDownCss = require('./github-markdown-css');

module.exports = {
  statickyWrapHtml: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>staticky</title>
    <script src="/socket.io/socket.io.js"></script>
    <script>var _$_socket=io({transports:["websocket","polling"]});_$_socket.on("reload",function(){window.location.reload()});</script>
  </head>
  <body>
  </body>
  </html>`,
  socketIoSctipt: '<script src="/socket.io/socket.io.js"></script><script>var _$_socket=io({transports:["websocket","polling"]});_$_socket.on("reload",function(){window.location.reload()});</script>',
  githubMarkDownCss: `<style>${githubMarkDownCss}.markdown-body{box-sizing:border-box;margin:0 auto;padding:45px;max-width:980px;min-width:200px}@media (max-width:767px){.markdown-body{padding:15px}}</style>`
};