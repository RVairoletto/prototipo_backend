module.exports = app =>{
    const{existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    const save = async (req, res)=>{
        const menu = {...req.body}
        try{
            existsOrError(menu.description, {"error":"Descrição não informada"})

            const userFromDB = await app.db('menu')
                .where({'menu.description':menu.description}).first()
            if(!menu.id){
                notExistsOrError(userFromDB, {"error":"Item já cadastrado"})
            }

        }catch(msg){
            return res.status(400)
        }
        if(menu.id){
            app.db('menu')
                .update(menu)
                .where({id:menu.id})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))
        } else{
             
            app.db('menu')
                .insert(menu)
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))   
        }

        if(!menu.id){
            
            const userFromDB = await app.db('menu')
                .where({'menu.description':menu.description}).first()
            
            app.db('levelpermission')
                .insert({
                    levelid : 1,
                    menuid: userFromDB.id,
                   }
               )
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))
        }
    }
    const get = (req, res)=> {
        app.db('menu')
            .select('id','description','text','pageroute')
            .then(menu=> res.json(menu))
            .catch(err=> res.status(500).send(err))
    }

    const getById = (req, res)=> {
        app.db('menu')
            .select('id','description','text','pageroute')
            .where({id: req.params.id})
            .first()
            .then(menu=> res.json(menu))
            .catch(err=> res.status(500).send(err))
    }

    const edit = async (req, res)=> {
        const menu = {...req.body}

        app.db('menu')
                .update(menu)
                .where({id:menu.id})
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send({err:"Não foi possivel editar"}))

    }
    return {save, get, getById, edit}
}