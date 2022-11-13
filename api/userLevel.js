

module.exports =  app =>{
    const{existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    /*
    salva o nivel de acesso do usuário (recebe o id do usuário (userid) 
    e id do nivel de acesso(levelid))
    */
    const save = async (req, res) => {
        const userlevel = {...req.body}

        try{
            existsOrError(userlevel.levelid, {"error":"Nivel de acesso não informado"})
            existsOrError(userlevel.userid, {"error":"usuário não informado"})

            const userFromDB = await app.db('userlevel')
                .where({'userlevel.levelid':userlevel.levelid,'userlevel.userid':userlevel.userid}).first()
            if(!userlevel.levelid||!userlevel.userid){
                notExistsOrError(userFromDB, {"error":"Permissão já cadastrada"})
            }

        }catch(msg){
            return res.status(400)
        }
       if(userlevel.levelid && userlevel.userid){
            app.db('userlevel')
                .update(userlevel)
                .where({levelid:userlevel.levelid, userid:userlevel.userid})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))
        } else{
            app.db('userlevel')
                .insert(userlevel)
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
        const userlevel = {...req.body}

        app.db('userlevel')
                .update(userlevel)
                .where({userid:userlevel.userid})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send({err:"Não foi possivel editar"}))

    }
    const deleteLevel = async (req,res)=>{
        try{
            
            const userFromDB = await app.db('userlevel') 
                .where({'userlevel.levelid': req.body.levelid,'userlevel.userid':req.body.userid})
            
            existsOrError(userFromDB, {"error":"Nivel de acesso não cadastrado"})
            

        }catch(msg){
            return res.status(400)
        }

        app.db('userlevel')
        .where({'userlevel.levelid':req.body.levelid,'userlevel.userid':req.body.userid})
        .del()
        .then(_=> res.status(204).send())
        .catch(err=> res.status(500).send({err:"Não foi possivel deletar"}))


    }

   

    return{ save, getLevel, editLevel,deleteLevel }
}