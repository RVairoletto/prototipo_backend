const {authSecret} = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')
const mailer = require ('../config/mailer')

module.exports = app =>{
    const signin = async (req, res) => {
        if(!req.body.email || !req.body.password){
            return res.status(400).send({"error":"Usuário ou senha não informados"})
        }
       

        const user = await app.db('users')
            .where({email: req.body.email})
            .first()

        if(!user) return res.status(400).send({"error":"Usuário não encontrado"})

        if(user.password.length()>20){
            const isMatch = bcrypt.compareSync(req.body.password, user.password)
        }
        if(!isMatch) return res.status(401).send({"error":"Email/Senha incorretos"})

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

    const forgotPassword = async (req, res) => {
        const {email}= req.body

        const user = await app.db('users')
            .where({email: req.body})
            .first()

        if(!user) return res.status(400).send({"error":"Usuário não encontrado"})

        if(user.disabled){
            return res.status(400).send({"error":"Usuário desabilitado"})
        }

        const token = crypto.randomBytes(12).toString('hex')

        app.db('users')
            .where({email: user.email})
            .update('password', token)
            .then(_=>res.status(204).send())
            .catch(err=> res.status(500).send(err))   
            
        mailer.sendEmail({
            to: user.email,
            from: 'ettspc@gmail.com',
            template: 'auth/forgot_password',
            context: {token},
        },(err)=>{
            if(err) return res.status(400).send({"error":"Cannot send forgot password"})

            return res.status(204).send()
        })

    }
    return{signin,validateToken, forgotPassword}
}