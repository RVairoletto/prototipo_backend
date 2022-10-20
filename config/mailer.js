const path = require ('path')
const nodemailer = require ('nodemailer')
const hbs = require ('nodemailer-express-handlebars')


module.exports = app=>{
    const transport = nodemailer.createTransport({
        host:"smtp.sendgrid.net",
        port: 25,
        auth:{
            user:"apikey",
            pass:"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"
        }
    })
    transport.use('compile',hbs({
        viewEngine:'handlebars',
        viewPath: path.resolve('./resources/mail/'),
        extName: '.html',
    }))
}