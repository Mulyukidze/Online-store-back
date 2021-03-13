const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        // gmail аккаунт для рассылки
        auth: {
            user: 'andreivazirov1@gmail.com', 
            pass: '123456Qwerty1' 
        }
    },
    {
        from: 'Mailer Test <andreivazirov1@gmail.com>' 
    }
)

module.exports = transporter