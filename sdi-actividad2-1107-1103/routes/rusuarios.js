module.exports = function (app, swig, gestorBD) {
    app.get("/usuarios", function (req, res) {
        res.send("ver usuarios");
    });
    app.get("/registrarse", function (req, res) {
        var respuesta = swig.renderFile('views/bregistro.html', {user: req.session.user});
        res.send(respuesta);
    });
    app.get("/identificarse", function (req, res) {
        var respuesta = swig.renderFile('views/bidentificacion.html', {user: req.session.user});
        res.send(respuesta);
    });
    app.get('/desconectarse', function (req, res) {
        req.session.user = null;
        app.set('current_user', null);
        var respuesta = swig.renderFile('views/bidentificacion.html', {user: req.session.user});
        res.send(respuesta);
    });
    app.post("/identificarse", function (req, res) {
        if (req.body.email === '' || req.body.email == null || req.body.password == null || req.body.password === '') {
            res.redirect("/identificarse" +
                "?mensaje=Debes rellenar el email y la contraseña" +
                "&tipoMensaje=alert-danger ");
        } else {
            var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            var criterio = {
                email: req.body.email,
                password: seguro
            };
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if (usuarios == null || usuarios.length === 0) {
                    req.session.user = null;
                    res.redirect("/identificarse" +
                        "?mensaje=Email o password incorrecto" +
                        "&tipoMensaje=alert-danger ");
                } else {
                    req.session.user = usuarios[0];
                    app.set('current_user', usuarios[0].email);
                    res.redirect("/publicaciones");
                }
            });
        }
    });

    app.post('/usuario', function (req, res) {
        var len = req.body.email;
        if (req.body.nombre == null || req.body.nombre == '' || req.body.apellidos == null || req.body.apellidos == '' ||
            req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '' ||
            req.body.repeatPassword == null || req.body.repeatPassword == '') {
            res.redirect("/registrarse?mensaje=Debes rellenar todos los campos");
        } else if (len.split("@").length != 2) {
            res.redirect("/registrarse?mensaje=El email no es valido");
        } else if (req.body.password === req.body.repeatPassword) {
            var email = req.body.email
            var aux = email.split(".");
            if (aux.length == 2) {
                var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                    .update(req.body.password).digest('hex');
                var usuario = {
                    nombre: req.body.nombre,
                    apellidos: req.body.apellidos,
                    email: req.body.email,
                    password: seguro,
                    rol: 'user',
                    dinero: 100
                }
                var criterio = {
                    email: usuario.email
                }
                gestorBD.obtenerUsuarios(criterio, function (users) {
                    if (users.length == 0) {
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
            } else {
                res.redirect("/registrarse?mensaje=El email no es valido");
            }

        } else {
            res.redirect("/registrarse?mensaje=Las contraseñas no coinciden")
        }
    });
    app.get('/listarUsuarios', function (req, res) {
        if(req.session.user.rol === "user"){
            res.redirect("/identificarse?mensaje=El usuario no es administrador");
        }else{
            let criterioMongo = {
                email: {
                    $ne: req.session.user.email // $ne es 'not' en Mongo
                }
            };
            gestorBD.obtenerUsuarios(criterioMongo, function (users) {
                if (users !== null) {
                    users.forEach(user => user.ABorrar = 'off');
                    let respuesta = swig.renderFile('views/listaUsuarios.html', {
                        user: req.session.user,
                        users: users
                    });
                    res.send(respuesta);
                } else {
                    res.redirect("/identificarse?mensaje=El email no es válido");
                }
            })
        }

    });

    app.post('/borrar', function (req, res) {
        console.log(req);
    });
};