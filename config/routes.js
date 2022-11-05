module.exports = app =>{
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/forgotPassword').post(app.api.auth.forgotPassword)  

    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)
        
    app.route('/users/edit').post(app.api.user.edit)
        
    app.route('/users/newPassword').post(app.api.user.newPassword)
        
    app.route('/users/disable').post(app.api.user.disable)
        
    app.route('/user/userLevel').post(app.api.user.userLevel)
        
    app.route('/user/filter').get(app.api.user.filterUser)
        
    app.route('/users/:id')
        .put(app.api.user.save)
        .get(app.api.user.getById)

    app.route('/accessLevel')
        .post(app.api.accessLevel.save)
        .get(app.api.accessLevel.get)
    
    app.route('/accessLevel/edit').post(app.api.accessLevel.edit)
   
    app.route('/accessLevel/:id')
        .put(app.api.accessLevel.save)
        .get(app.api.accessLevel.getById)
        .delete(app.api.accessLevel.deleteLevel)

    app.route('/menu')
        .post(app.api.menu.save)
        .get(app.api.menu.get)
    
    app.route('/menu/edit').post(app.api.menu.edit)
    
    app.route('/menu/:id')
        .put(app.api.menu.save)
        .get(app.api.menu.getById)

    app.route('/permission').post(app.api.accessLevel.newPermission)
        
    app.route('/permission/:levelId')
        .get(app.api.accessLevel.getPermission)


}