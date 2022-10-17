const bcrypt = require('bcrypt-nodejs')

module.exports =  app =>{
    const{existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    const encryptPassword = password =>{
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req,res) =>{
        const user = {...req.body}
        if(req.params.id) user.id = req.params.id

        try{
            existsOrError(user.name, {"error":"Nome não informado"})
            existsOrError(user.email,  {"error":"email não informado"})
            existsOrError(user.password,  {"error":"Senha não informada"})
            //existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
           // equalsOrError(user.password,user.confirmPassword,'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({email:user.email}).first()
            if(!user.id){
                notExistsOrError(userFromDB, {"error":"Usuário já cadastrado"})
            }

        }catch(msg){
            return res.status(400)
        }
        user.password = encryptPassword(user.password)
        

        if(user.id){
            app.db('users')
                .update(user)
                .where({id:user.id})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))
        } else{
            app.db('users')
                .insert(user)
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))

        }

    }
    const get = (req, res)=> {
        app.db('users')
            .select('id','name','email','admin','disabled')
            .then(users=> res.json(users))
            .catch(err=> res.status(500).send(err))
    }

    const getById = (req, res)=> {
        app.db('users')
            .select('id','name','email','admin','disabled')
            .where({id: req.params.id})
            .first()
            .then(user=> res.json(user))
            .catch(err=> res.status(500).send(err))
    }

    const newPassword = (req, res)=> {
        const user = {...req.body}

        user.password = encryptPassword(user.password)
        app.db('users')
            .where({id: user.id})
            .update('password', user.password)
            .then(users=>res.status(204).send())
            .catch(err=> res.status(500).send(err))       
    }

    const edit = (req, res)=> {
        const user = {...req.body}

        app.db('users')
                .update(user)
                .where({id:user.id})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))

    }

    const disable = (req,res) => {
        const user = {...req.body}
        app.db('users')
            .where({id: user.id})
            .update('disabled', user.disabled)
            .then(users=>res.status(204).send())
            .catch(err=> res.status(500).send(err))  
    }

    return{save, get,getById, newPassword, edit, disable }
}