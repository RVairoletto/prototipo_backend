

module.exports =  app =>{
    const{existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    //Função de cadastro de niveis de acesso do usuário (relação entre nivel e usuário)
    const save = async (req, res) => {
        const userLevel = {...req.body}

        try{
            existsOrError(userLevel.levelid, {"error":"Nivel de acesso não informado"})
            existsOrError(userLevel.userid, {"error":"usuário não informado"})

            const userFromDB = await app.db('user_level')
                .where({'user_level.levelid':userLevel.levelid,'user_level.userid':userLevel.userid}).first()
            if(!userLevel.id){
                notExistsOrError(userFromDB, {"error":"Permissão já cadastrada"})
            }

        }catch(msg){
            return res.status(400)
        }
       if(userLevel.id){
            app.db('user_level')
                .update(userLevel)
                .where({levelid:userLevel.levelid, userid:userLevel.userid})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))
        } else{
            app.db('user_level')
                .insert(userLevel)
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))

        }

       
    }
    //get de um nivel de acesso de um usuário
    const getLevel = async (req, res) => {
          app.db('user_level')
            .join('level','level.id', '=','user_level.levelid')
            .select('level.id','level.description')
            .where({userid: req.params.userid})
            .then(Lvl=> res.json(Lvl))
            .catch(err=> res.status(500).send(err))
    }
    //Função de edição do nivel de acesso do usuário
    const editLevel = async (req, res)=> {
        const userLevel = {...req.body}

        app.db('user_level')
                .update(userLevel)
                .where({userid:userLevel.userid})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send({err:"Não foi possivel editar"}))

    }
    ////Função de exclusão de um nivel de acesso do usuário
    const deleteLevel = async (req,res)=>{
        const userLevel = {...req.body}
        try{

            existsOrError(userLevel.levelid, {"error":"Id do nivel não informado"})
            existsOrError(userLevel.userid,  {"error":"Id do usuário não informado"})
            const userFromDB = await app.db('user_level') 
                .where({'user_level.levelid': userLevel.levelid,'user_level.userid':userLevel.userid}).first()
            
            existsOrError(userFromDB, {"error":"Nivel de acesso não cadastrado"})
            

        }catch(msg){
            return res.status(400)
        }

        app.db('user_level')
        .where({'user_level.levelid':userLevel.levelid,'user_level.userid':userLevel.userid})
        .del()
        .then(_=> res.status(204).send())
        .catch(err=> res.status(500).send({err:"Não foi possivel deletar"}))


    }

   

    return{ save, getLevel, editLevel,deleteLevel }
}