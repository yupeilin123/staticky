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
    });
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
    });
  </script> `,
  markdownLink: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" />',
  markdownCss: `<style>
    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 45px;
    }
    @media (max-width: 767px) {
      .markdown-body {
        padding: 15px;
      }
    }
  </style>`,
}