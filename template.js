module.exports = {
  wrapHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>staticky</title>
  <script src="/socket.io/socket.io.js"></script>
  <script>
    window.onload = function() {
      const socket = io();
      socket.on('reload', () => {
        window.location.reload();
      })
    }
  </script>
</head>
<body>
</body>
</html>`,
  socketSctipt: `  <script src="/socket.io/socket.io.js"></script>
  <script>
    window.onload = function() {
      const socket = io();
      socket.on('reload', () => {
        window.location.reload();
      })
    }
  </script> `,
  codeStyle: `<style>
    pre {
      padding: 10px;
      overflow: auto;
      border-radius: 3px;
      background: #f5f5f5;
    }
    code {
      padding: 2px 5px;
      color: #000000;
      background-color: #f0f0f0;
      font-family: Menlo,Monaco,Consolas,'Courier New',monospace;
      font-size: 14px;
    }
    pre code {
      padding: 0;
      line-height: 21px;
    }
  </style>`,
  markdownWrapDiv: `<div style="position:absolute;top:0;left:0;right:0;bottom:0;">
    <div style="padding:2em calc(50% - 457px)">markdown</div>
  </div>`
}