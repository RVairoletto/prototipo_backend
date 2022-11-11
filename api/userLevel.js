

module.exports =  app =>{
    const{existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    /*
    salva o nivel de acesso do usuário (recebe o id do usuário (userId) 
    e id do nivel de acesso(levelId))
    */
    const save = async (req, res) => {
        const userLevel = {...req.body}

        try{
            existsOrError(userLevel.levelId, {"error":"Nivel de acesso não informado"})
            existsOrError(userLevel.userId, {"error":"usuário não informado"})

            const userFromDB = await app.db('userLevel')
                .where({'userLevel.levelId':userLevel.levelId,'userLevel.userId':userLevel.userId}).first()
            if(!userLevel.levelId||!userLevel.userId){
                notExistsOrError(userFromDB, {"error":"Permissão já cadastrada"})
            }

        }catch(msg){
            return res.status(400)
        }
       if(userLevel.levelId && userLevel.userId){
            app.db('userLevel')
                .update(userLevel)
                .where({levelId:userLevel.levelId, userId:userLevel.userId})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))
        } else{
            app.db('userLevel')
                .insert(userLevel)
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))

        }

       
    }
    const getLevel = async (req, res) => {
          app.db('userLevel')
            .join('level','level.id', '=','userLevel.levelId')
            .select('level.id','level.description')
            .where({userId: req.params.userId})
            .then(Lvl=> res.json(Lvl))
            .catch(err=> res.status(500).send(err))
    }

    const editLevel = async (req, res)=> {
        const userLevel = {...req.body}

        app.db('userLevel')
                .update(userLevel)
                .where({userId:userLevel.userId})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send({err:"Não foi possivel editar"}))

    }
    const deleteLevel = async (req,res)=>{
        try{
            
            const userFromDB = await app.db('userLevel') 
                .where({'userLevel.levelId': req.body.id,'userLevel.userId':req.body.userId})
            
            existsOrError(userFromDB, {"error":"Nivel de acesso não cadastrado"})
            

        }catch(msg){
            return res.status(400)
        }

        app.db('userLevel')
        .where({'userLevel.levelId':req.body.levelId,'userLevel.userId':req.body.userId})
        .del()
        .then(_=> res.status(204).send())
        .catch(err=> res.status(500).send({err:"Não foi possivel deletar"}))


    }

   

    return{ save, getLevel, editLevel,deleteLevel }
}