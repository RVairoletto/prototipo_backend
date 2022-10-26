const bcrypt = require('bcrypt-nodejs')

module.exports =  app =>{
    const{existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    const encryptPassword = password =>{
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
    //Função de cadastro de usuário
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
    //função get usuário, retorna todos os usuários cadastrados
    const get = (req, res)=> {
        app.db('users')
            .join('level', 'users.levelId', '=', 'level.id')
            .select('users.id','users.name','users.email','users.admin','users.disabled','level.description')
            .then(users=> res.json(users))
            .catch(err=> res.status(500).send(err))
    }
    //função get usuário pelo id
    const getById = (req, res)=> {
        app.db('users')
            .join('level', 'users.levelId', '=', 'level.id')
            .where({'users.id': req.params.id})
            .select('users.id','users.name','users.email','users.admin','users.disabled','level.description')
            .first()
            .then(user=> res.json(user))
            .catch(err=> res.status(500).send({err:"Não foi possivel buscar o usuário"}))
    }

    //modifica a senha do usuário
    const newPassword = async (req, res)=> {
        const user = {...req.body}

        user.password = encryptPassword(user.password)
        app.db('users')
            .where({id: user.id})
            .update('password', user.password)
            .then(users=>res.status(204).send())
            .catch(err=> res.status(500).send(err))       
    }

    //modifica os dados do usuário
    const edit = async (req, res)=> {
        const user = {...req.body}

        app.db('users')
                .update(user)
                .where({id:user.id})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send({err:"Não foi possivel editar o usuário"}))

    }
    //desativa o usuário (muda o campo disabled para true)
    const disable = async (req,res) => {
        const user = {...req.body}
        app.db('users')
            .where({id: user.id})
            .update('disabled', user.disabled)
            .then(users=>res.status(204).send())
            .catch(err=> res.status(500).send(err))  
    }
    //modifica o nivel de acesso do usuário (recebe o id do usuário e a descrição do campo de acesso)
    const userLevel = async (req,res) => {
        const accessLevel = await app.db('level')
        .where({description:req.description}).first()

        app.db('users')
            .where({id: req.id})
            .update('levelId', accessLevel.id)
            .then(users=>res.status(204).send())
            .catch(err=> res.status(500).send(err))  
    }

    const filterUser = (req,res)=>{
        const user = {...req.body}

        if(user.email){
            app.db('users')
            .join('level', 'users.levelId', '=', 'level.id')
            .select('users.id','users.name','users.email','users.admin','users.disabled','level.description')
            .where({email: user.email})
            .first()
            .then(user=> res.json(user))
            .catch(err=> res.status(500).send(err))
        }
        else if(user.name){
            app.db('users')
            .join('level', 'users.levelId', '=', 'level.id')
            .select('users.id','users.name','users.email','users.admin','users.disabled','level.description')
            .where({email: user.email})
            .first()
            .then(user=> res.json(user))
            .catch(err=> res.status(500).send(err))
        }
    }

    return{save, get,getById, newPassword, edit, disable, userLevel, filterUser }
}