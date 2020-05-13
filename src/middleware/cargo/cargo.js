const schema = require('./schema')
const { serialInt } = require('./../../helpers/Functions')

class Cargo {

    constructor(){
        this.isCargo = true
        this.serial = serialInt('000000'),
        this.payload = null
        this.details = null
        this.directives = []
    }

    render(key, data){
        return schema[key](data)
    }

    loadDetails(label, data, key){
        if(!this.details) this.details = {}
        if(!this.details.messages) {
            delete this.details.timeout
            this.details.state = 'validation'
            this.details.messages = []
        }
        this.details.messages.push({
            key,
            message: this.render(label, data)
        })
        return this
    }

    setDetail(label, data, state = null){
        if(!this.details) this.details = {}
        this.details.state = state ? state : 'error'
        this.details.timeout = 6000
        this.details.message = this.render(label, data)
        return this
    }

    setOriginal(original){
        if(!this.details) this.details = {}
        this.details.original = original
        return this
    }

    setPayload(payload){
        this.payload = payload
        return this
    }

    loadDirective(directive){
        this.directives.push(directive)
        return this
    }

    persistDetail(time = 0){
        this.details.timeout = time
        return this
    }
}

module.exports = Cargo