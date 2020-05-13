# koatools
### Map
```js
/* Map */
const { models, middleware, helpers } = require('koatools')
const { BaseModel } = models
const { ErrorHandler, ErrorLogger, validateBody, cargo, koaio } = middleware
const { dd, randChar } = helpers
```

### Example App
```js
/* Example Koa App */
const Koa = require('koa')
const IO = require('koa-socket-2')
const bodyParser = require('koa-bodyparser')
const cors = require('kcors')
const app = new Koa()
const io = new IO()
const url = require('url')
const { server } = require('config')
const { middleware, helpers } = require('koatools')
const ErrorMutationHandler = require('./middleware/ErrorMutationHandler')
const SocketMapper = require('./middleware/SocketMapper')
const { ErrorHandler, ErrorLogger, NotFoundHandler, cargo, koaio } = middleware
const connections = {}

/* MIDDLEWARE */
app.use(cors())
app.use(bodyParser())
app.use(cargo())
app.use(koaio(io, {connections}))
app.use(ErrorHandler(ErrorMutationHandler))
app.on('error', ErrorLogger)
io.attach(app)

/* ROUTES */
app.use(router.account.routes())
app.use(router.user.routes())
app.use(NotFoundHandler)

/* SERVER */
app.listen(server.port, () => {
    console.log(url.format(server))
})

SocketMapper({io, connections})
```

### Example Middleware
```js
/* SocketMapper.js Example File */
module.exports = ({io, connections}) => {

    io.on('connect', (socket) => {
        connections[socket.id] = {
            ip: socket.request.connection.remoteAddress,
            useragent: socket.request.headers['user-agent']
        }
        console.log({added:socket.id})
    })
    
    io.on('disconnect', ({socket}) => {
        delete connections[socket.id]
         console.log({removed:socket.id})
    })
}


/* ErrorMutationHandler.js Example File */
module.exports = async (err, ctx, next) => {
    // cargo is a predefined response object structure
    err.id = ctx.cargo.serial
    // add your code here ...
    return ctx.cargo
}


/* ErrorMutationHandler.js Example File This Dependencies */
module.exports = async (err, ctx, next) => {
    err.id = ctx.cargo.serial
    
    /* JWT EXCEPTION MUTATOR */
    if(err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
        ctx.status = 401
        if(err.message === 'invalid signature') ctx.cargo.setDetail('invalid', 'token signature')
        if(err.message === 'invalid token') ctx.cargo.setDetail('invalid', 'token')
        if(err.message === 'jwt must be provided') ctx.cargo.setDetail('required', 'authentication').loadDirective('to-login')
        if(err.message === 'jwt expired') {
            const noun = ctx.get('x-refresh-token') ? 'refresh' : 'access'
            ctx.cargo.setDetail('expired', noun + '-token')
        } else {
            ctx.cargo.loadDirective('logout')
        }
    }

    /* VALIDATION EXCEPTION MUTATOR */
    if(err instanceof ValidationError) {
        ctx.status = 422
        const { details, _original } = err
        ctx.cargo.setOriginal(_original)

        for (let detail of details) {
            const { type, context: { label, key, limit, valids } } = detail
            let ref = valids ? valids[0].key : null
            ctx.cargo.loadDetails(type, { label, limit, ref }, key)
        }
    }

    /* DATABASE EXCEPTION MUTATOR */
    if(err instanceof UniqueViolationError) {
        ctx.status = 422
        let key = err.columns.pop()
        ctx.cargo.loadDetails('duplicate', key, key)
    }

    /* DEFAULT EXCEPTION MUTATOR */
    if(!ctx.cargo.details){
        ctx.cargo.setDetail('unknown', ctx.cargo.serial)
        ctx.cargo.persistDetail()
        ctx.app.emit('error', err, ctx)
    }

    return ctx.cargo
}

/* ValidationSchemas.js Example File */
const Joi = require('@hapi/joi') 

module.exports = {
    
    /* ACCOUNT SCHEMAS */

    register: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        username: Joi.string().lowercase().min(1).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(120).required(),
        passwordConfirm: Joi.any().valid(Joi.ref('password')),
    }), 

    username: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        username: Joi.string().lowercase().min(1).max(30).required(),
    }), 
}

```