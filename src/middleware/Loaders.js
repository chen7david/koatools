

module.exports = {
  
    koaio: (io = null, obj = {}) => async (ctx, next) => {
        if(io){
            ctx.io = io
            if(obj && obj.connections) ctx.state.io = obj
        }else{
            console.log('socket io was not loaded, please provide a valid socket instance!')
        }
        await next()
    }
}