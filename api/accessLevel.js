
module.exports = app =>{
    const{existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    const save = async (req, res)=>{
        const accessLevel = {...req.body}
        try{
            existsOrError(accessLevel.description, {"error":"Descrição não informada"})

            const userFromDB = await app.db('level')
                .where({'level.description':accessLevel.description}).first()
            if(!accessLevel.id){
                notExistsOrError(userFromDB, {"error":"Nivel de acesso já cadastrado"})
            }

        }catch(msg){
            return res.status(400)
        }
       
        if(accessLevel.id){
            app.db('level')
                .update(accessLevel)
                .where({id:accessLevel.id})
                .then(_=> res.status(200).json(accessLevel))
                .catch(err=> res.status(500).send(err))
        } else{
            await app.db('level')
                    .insert(accessLevel)
            
            app.db('level')
                .select('id','description')
                .then(Lvl=> res.json(Lvl))
                .catch(err=> res.status(500).send(err))

        }
    }
    const get = (req, res)=> {
        app.db('level')
            .select('id','description')
            .then(Lvl=> res.json(Lvl))
            .catch(err=> res.status(500).send(err))
    }

    const getById = (req, res)=> {
        app.db('level')
            .select('id','description')
            .where({id: req.params.id})
            .first()
            .then(Lvl=> res.json(Lvl))
            .catch(err=> res.status(500).send(err))
    }

    const edit = async (req, res)=> {
        const accessLevel = {...req.body}

        app.db('level')
                .update(accessLevel)
                .where({id:accessLevel.id})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send({err:"Não foi possivel editar"}))

    }

    const newPermission = async (req, res) => {
        const permission = {...req.body}

        try{
            existsOrError(permission.levelId, {"error":"Nivel de acesso não informado"})
            existsOrError(permission.menuId, {"error":"Permissão não informada"})

            const userFromDB = await app.db('levelpermission')
                .where({'levelpermission.levelid':permission.levelId,'levelpermission.menuid':permission.menuId}).first()
            if(!permission.levelId||!permission.menuId){
                notExistsOrError(userFromDB, {"error":"Permissão já cadastrada"})
            }

        }catch(msg){
            return res.status(400)
        }
       if(permission.levelId && permission.menuId){
            app.db('levelpermission')
                .update(permission)
                .where({levelid:permission.levelId, menuid:permission.menuId})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))
        } else{
            app.db('levelpermission')
                .insert(permission)
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))

        }

       
    }
    const getPermission = async (req, res) => {
          app.db('levelpermission')
            .join('menu','menu.id', '=','levelpermission.menuid')
            .select('menu.id','menu.description','levelpermission.id')
            .where({levelid: req.params.levelId})
            .then(Lvl=> res.json(Lvl))
            .catch(err=> res.status(500).send(err))
    }

    const editPermission = async (req, res)=> {
        const permission = {...req.body}

        app.db('levelpermission')
                .update(permission)
                .where({levelid:accessLevel.id})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send({err:"Não foi possivel editar"}))

    }

    const deleteLevel = async (req,res)=>{
        try{
            
            const userFromDB = await app.db('userlevel') 
                .where({'userlevel.levelid': req.body.id})
            
            notExistsOrError(userFromDB, {"error":"Nivel de acesso tem usuários cadastrados"})
            

        }catch(msg){
            return res.status(400)
        }

        const userFromDB = await app.db('levelpermission') 
        .where({'levelpermission.levelid': req.body.id})
       
        if(userFromDB){
            app.db('levelpermission')
            .where({'levelpermission.levelid':req.body.id})
            .del()
        }
        app.db('level')
        .where({'level.id':req.body.id})
        .del()
        .then(_=> res.status(204).send())
        .catch(err=> res.status(500).send({err:"Não foi possivel deletar"}))


    }
   
    return {save, get, getById, edit, newPermission, getPermission, deleteLevel, editPermission}
}