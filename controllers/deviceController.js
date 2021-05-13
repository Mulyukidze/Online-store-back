const uuid = require('uuid')
const path = require('path');
const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError');

class DeviceController {
    //POST
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({name, price, brandId, typeId, img: fileName});
//с awaitom подождать а потом json отдавать
//promise all обвернуть
            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                )
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }
    //getAll
    async getAll(req, res) {
        let {brandId, typeId, limit, page, ordersprice} = req.query
        ordersprice = ordersprice || "ASC"
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset, order: [['price', ordersprice]]})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where:{brandId}, limit, offset, order: [['price', ordersprice]]})
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId}, limit, offset, order: [['price', ordersprice]]})
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId, brandId}, limit, offset, order: [['price', ordersprice]]})
        }
        return res.json(devices)
    }
    //getOne
    async getOne(req, res, next) {
        try {
            const id = req.params.id
            const device = await Device.findOne(
                {
                    where: {id},
                    include: [{model: DeviceInfo, as: 'info'}]
                },
            )
            return res.json(device ? device : 'ID не найден')
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
    //PUT+getOne
    async updateDevice(req, res, next) {
        try {
            const id = req.params.id
            let device = await Device.findByPk(id)
            device = await Device.update(req.body, {
                where: { id: id }
            })
            device = await Device.findOne({
                where: { id }
            })
            return res.json(device ? device : 'ID не найден')
        } catch (e) {
        next(ApiError.internal(e.message))
        }
    }
    //DELETE
    async deleteDevice(req, res, next) {
        try {
            const id = req.params.id;
            let device = await Device.findByPk(id)
            device = await Device.destroy({
                where: { id }
            })
            return res.json(device ? 'Запись удалена' : 'ID не найден')
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}
module.exports = new DeviceController()
