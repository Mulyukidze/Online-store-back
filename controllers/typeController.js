const { Type } = require('../models/models')
const ApiError = require('../error/ApiError');

class TypeController {
    //POST
    async create(req, res) {
        const { name } = req.body
        const type = await Type.create({ name })
        return res.json(type)
    }
    //getAll
    async getAll(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }
    //getOne
    async getOne(req, res, next) {
        try {
            const id = req.params.id
            const type = await Type.findOne({
                where: { id }
            })
            return res.json(type ? type : 'ID не найден')
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
    //PUT+getOne
    async updateType(req, res, next) {
        try {
            const id = req.params.id
            let type = await Type.findByPk(id)
            type = await Type.update(req.body, {
                where: { id: id }
            })
            type = await Type.findOne({
                where: { id }
            })
            return res.json(type ? type : 'ID не найден')
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
    //DELETE
    async deleteType(req, res, next) {
        try {
            const id = req.params.id;
            let type = await Type.findByPk(id)
            type = await Type.destroy({
                where: { id }
            })
            return res.json(type ? 'Запись удалена' : 'ID не найден')
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new TypeController()
