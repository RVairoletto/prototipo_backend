const {authSecret} = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')
const mailer = require ('../config/mailer')
const path = require ('path')
const nodemailer = require ('nodemailer')
const hbs = require ('nodemailer-express-handlebars')
const {host, port, user, pass} = require ('../config/mail.json')

module.exports = app =>{
    //criptografia utilizando o bcrypt
    const encryptPassword = password =>{
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
     /*Função de login de usuário, verifica se todos os dados foram informados 
     e estão corretos
    */
    const signin = async (req, res) => {
        if(!req.body.email || !req.body.password){
            return res.status(400).send({"error":"Usuário ou senha não informados"})
        }
       

        const user = await app.db('users')
            .where({email: req.body.email})
            .first()

        if(!user) return res.status(400).send({"error":"Usuário não encontrado"})

        if(user.password.toString().length < 12){
            const pass = encryptPassword(user.password)

            app.db('users')
            .where({email: user.email})
            .update('password', pass)
            
        }
        if(user.password != req.body.password){
            const isMatch = bcrypt.compareSync(req.body.password, user.password)
            if(!isMatch) return res.status(401).send({"error":"Email/Senha incorretos"})
        }
        

        if(user.disabled){
        return res.status(400).send({"error":"Usuário desabilitado"})
        }

        const now = Math.floor(Date.now()/1000)

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            disabled: user.disabled,
            iat: now,
            exp: now + (60*60*24)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }
    //Função que valida o token gerado no login
    const validateToken = async(req,res) =>{
        const userData = req.body || null 
        try {
            if(userData){
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp *1000)> new Date()){
                    return res.send({"res":true})
                }
            }
        } catch (e) {
            
        }
        res.send({"res":false})
    }
    //Função esqueci a senha
    const forgotPassword = async (req, res) => {

        const transport = nodemailer.createTransport({
            host,
            port,
            auth:{
                user,
                pass
            }
        })
        /*transport.use('compile',hbs({
            viewEngine:'handlebars',
            viewPath: path.resolve('./resources/mail/'),
            extName: '.html',
        }))*/
        
        const users = await app.db('users')
            .where({email: req.body.email})
            .first()

        if(!users) return res.status(400).send({"error":"Usuário não encontrado"})

        if(users.disabled){
            return res.status(400).send({"error":"Usuário desabilitado"})
        }

        const token = crypto.randomBytes(8).toString('hex')
    
        transport.sendMail({
            to: users.email,
            from: 'exemplo@gmail.com',
            text: "Nova senha",
            html: "<b>Sua nova senha é: </b>"+token,
            context: {token},
        },(err)=>{
            if(err) return res.status(400).send({"error":"Cannot send forgot password"})

            return res.status(204).send()
        })

        const password = encryptPassword(token)

        app.db('users')
            .where({email: users.email})
            .update('password', password)
            .then(_=>res.status(204).send())
            .catch(err=> res.status(500).send(err))   

    }
    return{signin,validateToken, forgotPassword}
}