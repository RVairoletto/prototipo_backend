
module.exports = app =>{
    const{existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    const save = async (req, res)=>{
        const accessLevel = {...req.body}
        try{
            existsOrError(accessLevel.description, {"error":"Descrição não informada"})

            const userFromDB = await app.db('level')
                .where({description:accessLevel.description}).first()
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
                .then(_=> res.status(204).send())
                .catch(err=> res.status(500).send(err))
        } else{
            app.db('level')
                .insert(accessLevel)
                .then(_=> res.status(204).send())
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
    return {save, get, getById}
}