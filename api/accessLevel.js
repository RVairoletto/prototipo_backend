
module.exports = app =>{
    const{existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    /*Função de cadastro de nivel de acesso, verifica se os dados foram informados 
    e se já há um nivel de acesso com esses dados cadastrados
    */
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
                .where({description:accessLevel.description})
                .then(Lvl=> res.json(Lvl))
                .catch(err=> res.status(500).send(err))

        }
    }
    // get dos niveis de acesso
    const get = (req, res)=> {
        app.db('level')
            .select('id','description')
            .then(Lvl=> res.json(Lvl))
            .catch(err=> res.status(500).send(err))
    }
    //get de um nivel de acesso
    const getById = (req, res)=> {
        app.db('level')
            .select('id','description')
            .where({id: req.params.id})
            .first()
            .then(Lvl=> res.json(Lvl))
            .catch(err=> res.status(500).send(err))
    }
    //Função de edição de um nivel de acesso
    const edit = async (req, res)=> {
        const accessLevel = {...req.body}

        if(accessLevel.id == 1)return res.status(401).send({"error":"Edição não permitida"})

        app.db('level')
                .update(accessLevel)
                .where({id:accessLevel.id})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send({err:"Não foi possivel editar"}))

    }
     /*Função de cadastro de permissão nivel de acesso, verifica se os dados foram informados 
    e se essa permissão já foi cadastrada
    */
    const newPermission = async (req, res) => {
        const permission = {...req.body}

        try{
            existsOrError(permission.levelid, {"error":"Nivel de acesso não informado"})
            existsOrError(permission.menuid, {"error":"Permissão não informada"})

            const userFromDB = await app.db('level_permission')
                .where({'level_permission.levelid':permission.levelid,'level_permission.menuid':permission.menuid}).first()
            if(!permission.id){
                notExistsOrError(userFromDB, {"error":"Permissão já cadastrada"})
            }

        }catch(msg){
            return res.status(400)
        }
       if(permission.id ){
            app.db('level_permission')
                .update(permission)
                .where({levelid:permission.levelid, menuid:permission.menuid})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))
        } else{
            app.db('level_permission')
                .insert(permission)
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send({err:"erro ao cadastrar permissão"}))
        }

       
    }
    //get de uma permissão do nivel de acesso (relação entre o nivel e menu)
    const getPermission = async (req, res) => {
          app.db('level_permission')
            .join('menu','menu.id', '=','level_permission.menuid')
            .select('menu.id','menu.description','level_permission.id')
            .where({levelid: req.params.levelid})
            .then(Lvl=> res.json(Lvl))
            .catch(err=> res.status(500).send(err))
    }
    //Função de edição da permissão de um nivel de acesso
    const editPermission = async (req, res)=> {
        const permission = {...req.body}
        
        app.db('level_permission')
                .update(permission)
                .where({levelid:accessLevel.id})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send({err:"Não foi possivel editar"}))

    }
    //Função de exclusão de um nivel de acesso
    const deleteLevel = async (req,res)=>{
        try{
            
            const userFromDB = await app.db('user_level') 
                .where({'user_level.levelid': req.body.id})
            
            notExistsOrError(userFromDB, {"error":"Nivel de acesso tem usuários cadastrados"})
            

        }catch(msg){
            return res.status(400)
        }

        const userFromDB = await app.db('level_permission') 
        .where({'level_permission.levelid': req.body.id})
       
        if(userFromDB){
            app.db('level_permission')
            .where({'level_permission.levelid':req.body.id})
            .del()
        }
        app.db('level')
        .where({'level.id':req.body.id})
        .del()
        .then(_=> res.status(204).send())
        .catch(err=> res.status(500).send({err:"Não foi possivel deletar"}))


    }
    //Função de exclusão de permissões do nivel de acesso
    const deletePermission = async (req, res) => {
        const userFromDB = await app.db('level_permission') 
        .where({'level_permission.levelid': req.body.levelid})
       
        if(userFromDB){
            app.db('level_permission')
            .where({'level_permission.levelid':req.body.levelid})
            .del()
            .then(_=> res.status(204).send())
            .catch(err=> res.status(500).send({err:"Não foi possivel deletar"}))
        }
  }
   
    return {save, get, getById, edit, newPermission, getPermission, deleteLevel, editPermission,deletePermission }
}