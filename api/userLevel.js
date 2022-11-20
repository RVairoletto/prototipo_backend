

module.exports =  app =>{
    const{existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    /*
    salva o nivel de acesso do usuário (recebe o id do usuário (userid) 
    e id do nivel de acesso(levelid))
    */
    const save = async (req, res) => {
        const userLevel = {...req.body}

        try{
            existsOrError(userLevel.levelid, {"error":"Nivel de acesso não informado"})
            existsOrError(userLevel.userid, {"error":"usuário não informado"})

            const userFromDB = await app.db('userlevel')
                .where({'userlevel.levelid':userLevel.levelid,'userlevel.userid':userLevel.userid}).first()
            if(!userLevel.id){
                notExistsOrError(userFromDB, {"error":"Permissão já cadastrada"})
            }

        }catch(msg){
            return res.status(400)
        }
       if(userLevel.id){
            app.db('userlevel')
                .update(userLevel)
                .where({levelid:userLevel.levelid, userid:userLevel.userid})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))
        } else{
            app.db('userlevel')
                .insert(userLevel)
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))

        }

       
    }
    const getLevel = async (req, res) => {
          app.db('userlevel')
            .join('level','level.id', '=','userlevel.levelid')
            .select('level.id','level.description')
            .where({userid: req.params.userid})
            .then(Lvl=> res.json(Lvl))
            .catch(err=> res.status(500).send(err))
    }

    const editLevel = async (req, res)=> {
        const userLevel = {...req.body}

        app.db('userlevel')
                .update(userLevel)
                .where({userid:userLevel.userid})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send({err:"Não foi possivel editar"}))

    }
    const deleteLevel = async (req,res)=>{
        const userLevel = {...req.body}
        try{
            
            existsOrError(userLevel.levelid, {"error":"Id do nivel não informado"})
            existsOrError(userLevel.userid,  {"error":"Id do usuário não informado"})
            const userFromDB = await app.db('userlevel') 
                .where({'userlevel.levelid': userLevel.levelid,'userlevel.userid':userLevel.userid})
            
            existsOrError(userFromDB, {"error":"Nivel de acesso não cadastrado"})
            

        }catch(msg){
            return res.status(400)
        }

        app.db('userlevel')
        .where({'userlevel.levelid':userLevel.levelid,'userlevel.userid':userLevel.userid})
        .del()
        .then(_=> res.status(204).send())
        .catch(err=> res.status(500).send({err:"Não foi possivel deletar"}))


    }

   

    return{ save, getLevel, editLevel,deleteLevel }
}