module.exports = function(app, swig, gestorBD) {
    app.get("/usuarios", function(req, res) {
        res.send("ver usuarios");
    });
    app.get("/registrarse", function(req, res) {
        var respuesta = swig.renderFile('views/bregistro.html', {});
        res.send(respuesta);
    });
    app.get("/identificarse", function(req, res) {
        var respuesta = swig.renderFile('views/bidentificacion.html', {});
        res.send(respuesta);
    });
    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.send("Usuario desconectado");
    })
    app.post("/identificarse", function(req, res) {
        if(req.body.email == '' || req.body.email == null || req.body.password == null || req.body.password == ''){
            res.redirect("/identificarse" +
                "?mensaje=Debes rellenar el email y la contraseña"+
                "&tipoMensaje=alert-danger ");
        }else{
            var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            var criterio = {
                email : req.body.email,
                password : seguro
            }
            gestorBD.obtenerUsuarios(criterio, function(usuarios) {
                if (usuarios == null || usuarios.length == 0) {
                    app.set('usuario', null);
                    res.redirect("/identificarse" +
                        "?mensaje=Email o password incorrecto"+
                        "&tipoMensaje=alert-danger ");
                } else {
                    app.set('usuario', usuarios[0]);
                    res.redirect("/publicaciones");
                }
            });
        }
    });

    app.post('/usuario', function(req, res) {
        if(req.body.nombre==null || req.body.nombre=='' || req.body.apellidos==null || req.body.apellidos=='' ||
            req.body.email==null || req.body.email=='' || req.body.password==null || req.body.password=='' ||
            req.body.repeatPassword==null || req.body.repeatPassword=='') {
            res.redirect("/registrarse?mensaje=Debes rellenar todos los campos");
        }
        else if(req.body.password===req.body.repeatPassword) {
            var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            var usuario = {
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                email: req.body.email,
                password: seguro,
                rol: 'user'
            }
            var criterio = {
                email: usuario.email
            }
            var collection = db.collection('usuarios');
            collection.find(criterio).toArray(function (err, users) {
                if (err) {
                    res.redirect("/registrarse?mensaje=Error al registrar usuario");
                } else if (users.length == 0) {
                    console.log("Usuario: " + usuario.nombre + " " + usuario.apellidos);
                    gestorBD.insertarUsuario(usuario, function (id) {
                        if (id == null) {
                            res.redirect("/registrarse?mensaje=Error al registrar usuario");
                        } else {
                            res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
                        }
                    });
                } else {
                    res.redirect("/registrarse?mensaje=Ya hay un usuario registrado con ese email");
                }
            });
        }else{
            res.redirect("/registrarse?mensaje=Las contraseñas no coinciden")
        }
    })

};
