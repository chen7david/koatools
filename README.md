# koatools
```js
/* Map */
const { models, middleware, helpers } = require('koatools')
const { BaseModel } = models
const { ErrorHandler, ErrorLogger, validateBody, cargo, koaio } = middleware
const { dd, randChar } = helpers

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

## Example Middleware
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

```