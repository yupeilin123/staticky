const serve_static = require('serve-static')

/**
 * 
 * @param {String} root 
 * @param {Object} options 
 */
function serveStatic(root, options) {
  const fn = serve_static(root, options)
  return async (ctx, next) => {
    await new Promise((resolve, reject) => {
      if (ctx.status === 404) ctx.status = 200
      ctx.respond = false
      fn(ctx.req, ctx.res, resolve);
    })
    await next();
  }
}

module.exports = serveStatic