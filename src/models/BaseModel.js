const { pluralize, timestamp, notIn } = require('./../helpers/Functions')

module.exports = (Model) => {

    class BaseModel extends Model {

        static get tableName() {
            return pluralize(this.name.toLowerCase())
        }

        static async getById(id){
            id = id ? parseInt(id, 10) : null
            if(!id) return null
            return await this.getByKey('id', id)
        }

        static async getByKey(key, value){
            return await this
                .query()
                .where(key, value)
                .first()
        }

        async $sync(relation, target, customId){
            try {
                const result = await BaseModel.transaction(async (trx) => {
                    const related = await this.$relatedQuery(relation)
                    const original = related.map(el => el.id)
                    const add = notIn(target, original)
                    const remove = notIn(original, target)
                    if(add.length + remove.length == 0) return false
                    const relId = customId ? customId : 
                        pluralize.singular(relation) + '_id'
                    
                    const added = await this
                        .$relatedQuery(relation)
                        .relate(add)
                    const removed = await this
                        .$relatedQuery(relation)
                        .unrelate()
                        .whereIn(relId, remove)
                    return added + removed > 0
                })
                return result
                
            } catch (err) {
                console.log(err)
                return false
            }
        }

        async $beforeInsert(){
            this.created_at = timestamp()
            this.updated_at = timestamp()
        }

        async $beforeUpdate(){
            this.updated_at = timestamp() 
        }
    }

    return BaseModel
}