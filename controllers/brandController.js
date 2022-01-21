const { Brand } = require('../models/models')
const ApiError = require('../error/ApiError');
const db = require('../db')


class BrandController {
    //POST
    async create(req, res, next) {
        try {
            const { name } = req.body
            const brand = await Brand.create({ name })
            return res.json(brand)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    //GET ALL
    async getAll(req, res, next) {
        try {
            const brands = await Brand.findAll()
            return res.json(brands)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
    //getOne
    async getOne(req, res, next) {
        try {
            const id = req.params.id
            const brand = await Brand.findOne({
                where: { id }
            })
            return res.json(brand ? brand : 'ID не найден')
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
    //PUT+getOne
    async updateBrand(req, res, next) {
        try {
            const id = req.params.id
            let brand3 = await Brand.findByPk(id)
            brand3 = await Brand.update(req.body, {
                where: { id: id }
            })
            brand3 = await Brand.findOne({
                where: { id }
            })
            return res.json(brand3 ? brand3 : 'ID не найден')
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
    //DELETE+getOne
    async deleteBrand(req, res, next) {
        try {
            const id = req.params.id;
            let brand = await Brand.findByPk(id)
            brand = await Brand.destroy({
                where: { id }
            })
            return res.json(brand ? 'Запись удалена' : 'ID не найден')
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new BrandController()
