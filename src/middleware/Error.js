module.exports = {

  NotFoundHandler: async (ctx) => {
      ctx.status = 404; 
      switch (ctx.accepts('html', 'json')) {
        case 'html':
        ctx.type = 'html';
        ctx.body = '<p>page not found</p>';
        break;
        case 'json':
        ctx.body = {
            message: 'page not found'
        };
        break;
        default:
        ctx.type = 'text';
        ctx.body = 'page not found';
      }
  },  
  
  ErrorHandler: (cb) => async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        const payload = await cb(err, ctx, next)
        ctx.status = err.status || 500
        ctx.body = payload
        ctx.app.emit('error', err, ctx)
      }
  },

  ErrorLogger: async (err, ctx) => {
    const errId = err.id ? `ER${err.id}` : 'ERROR'
    console.log({errId, err})
  }

}