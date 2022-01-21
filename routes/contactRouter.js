const Router = require('express')
const router = new Router()
const mailer = require('../config/nodemailer')

router.post('/', (req, res) => {
    //start nodemailer
    const message = {
        to: `mulyuk98@gmail.com`,
        subject: 'Обратная связь от клиента',
        html: `
        <h2>Email клиента: ${req.body.email}</h2>
        <p>Текст: ${req.body.text}<p>`
    }
    mailer.sendMail(message, (err, info) => {
        if (err) return console.log(err)
        return res.json({ status: info.rejected.length < 1 ? 'success' : 'failed' })
    })
    //end nodemailer
})
module.exports = router