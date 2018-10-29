module.exports = {
  statickyWrapHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>staticky</title>
  <script src="/socket.io/socket.io.js"></script>
  <script>
    var socket = io({
      transports: ['websocket','polling']
    });
    socket.on('reload',() => {
      window.location.reload();
    })
  </script>
</head>
<body>
</body>
</html>`,
  socketIoSctipt: `  <script src="/socket.io/socket.io.js"></script>
  <script>
    var socket = io({
      transports: ['websocket','polling']
    });
    socket.on('reload',() => {
      window.location.reload();
    })
  </script> `,
  markdownLink: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" />',
  markdownWrapDiv: `<div style="position:absolute;top:0;left:0;right:0;bottom:0;">
    <div style="padding:2em calc(50% - 457px)">markdown</div>
  </div>`
}