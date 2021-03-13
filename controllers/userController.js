const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')
const mailer = require('../config/nodemailer')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role)
        //start nodemailer
        const message = {
            to: req.body.email,
            subject: 'Поздравляю! Вы успешно зарегистрировались на нашем сайте',
            html: `
            <h2>Поздравляем, Вы успешно зарегистрировались на нашем сайте!</h2>
            
            <i>данные вашей учетной записи:</i>
            <ul>
                <li>login: ${req.body.email}</li>
                <li>password: ${req.body.password}</li>
            </ul>
            Вы подписаны на рассылку наших акций и предложений,
            чтобы отписаться от рассылки перейдите по ссылке
            <a href="http://localhost:5000/unsubscribe/${req.body.email}/">отписаться от рассылки</a>
            <p>Данное письмо не требует ответа.<p>`
        }
        mailer.sendMail(message, (err, info) => {
                if(err) return console.log(err)
                return res.json({status:info.rejected.length < 1 ? 'success' : 'failed', token})
            })
        //end nodemailer
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()
