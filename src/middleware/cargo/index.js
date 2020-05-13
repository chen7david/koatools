const Cargo = require('./cargo')

exports = module.exports = () => async (ctx, next) => {
    ctx.cargo = new Cargo
    await next()
}

exports.Cargo = Cargo