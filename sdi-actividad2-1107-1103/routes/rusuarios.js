module.exports = function (app, swig, gestorBD) {
    app.get("/registrarse", function (req, res) {
        var respuesta = swig.renderFile('views/bregistro.html', {user: req.session.user});
        app.get("logger").info('El usuario se ha registrado');
        res.send(respuesta);
    });
    app.get("/identificarse", function (req, res) {
        var respuesta = swig.renderFile('views/bidentificacion.html', {user: req.session.user});
        app.get("logger").info('El usuario se encuentra en la página de inicio de sesión');
        res.send(respuesta);
    });
    app.get('/desconectarse', function (req, res) {
        req.session.user = null;
        app.set('current_user', null);
        var respuesta = swig.renderFile('views/bidentificacion.html', {user: req.session.user});
        app.get("logger").info('El usuario se ha desconectado');
        res.send(respuesta);
    });
    app.post("/identificarse", function (req, res) {
        if (req.body.email === '' || req.body.email == null || req.body.password == null || req.body.password === '') {
            app.get("logger").error("Campos vacíos al iniciar sesión");
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
                if (usuarios == null || usuarios.length === 0 || usuarios[0].valid === false) {
                    req.session.user = null;
                    app.get("logger").error("Email o contraseña incorrectos");
                    res.redirect("/identificarse" +
                        "?mensaje=Email o password incorrecto" +
                        "&tipoMensaje=alert-danger ");
                } else {
                    req.session.user = usuarios[0];
                    delete req.session.user.password;
                    app.set('current_user', usuarios[0].email);
                    if (req.session.user.rol === 'admin') {
                        console.log("Identificado como administrador");
                        app.get("logger").info('El administrador es dirigido a la lista de usuarios');
                        res.redirect("/listarUsuarios")
                    } else {
                        app.get("logger").info('El usuario es dirigido a la vista Home');
                        res.redirect("/home");
                    }
                }
            });
        }
    });

    app.post('/usuario', function (req, res) {
        var len = req.body.email;
        if (req.body.nombre == null || req.body.nombre === '' || req.body.apellidos == null || req.body.apellidos === '' ||
            req.body.email == null || req.body.email === '' || req.body.password == null || req.body.password === '' ||
            req.body.repeatPassword == null || req.body.repeatPassword === '') {
            res.redirect("/registrarse?mensaje=Debes rellenar todos los campos");
        } else if (len.split("@").length !== 2) {
            app.get("logger").error("El email no es válido");
            res.redirect("/registrarse?mensaje=El email no es válido");
        } else if (req.body.password === req.body.repeatPassword) {
            var email = req.body.email
            var aux = email.split(".");
            if (aux.length === 2) {
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
                    if (users.length === 0) {
                        gestorBD.insertarUsuario(usuario, function (id) {
                            if (id == null) {
                                app.get("logger").error("Error al registrar usuario");
                                res.redirect("/registrarse?mensaje=Error al registrar usuario");
                            } else {
                                req.session.user = usuario;
                                delete req.session.user.password;
                                app.set('current_user', usuario.email);
                                app.get("logger").info('El usuario se ha dirigido a la vista Home');
                                res.redirect("/home");
                            }
                        });
                    } else {
                        app.get("logger").error("Ya existe un usuario registrado con este email");
                        res.redirect("/registrarse?mensaje=Ya hay un usuario registrado con ese email");
                    }
                });
            } else {
                app.get("logger").error("El email no es válido");
                res.redirect("/registrarse?mensaje=El email no es válido");
            }

        } else {
            app.get("logger").error("Las contraseñas no coinciden");
            res.redirect("/registrarse?mensaje=Las contraseñas no coinciden")
        }
    });
    app.get('/listarUsuarios', function (req, res) {
        let criterioMongo = {
            $and: [
                {
                    email: {
                        $ne: req.session.user.email
                    }
                },
                {
                    valid: {
                        $ne: false
                    }
                }
            ]
        };

        gestorBD.obtenerUsuarios(criterioMongo, function (users) {
            if (users !== null) {
                var respuesta = swig.renderFile('views/listaUsuarios.html', {
                    user: req.session.user,
                    users: users
                });
                res.send(respuesta);
            } else {
                app.get("logger").error("El email no es válido");
                res.redirect("/identificarse?mensaje=El email no es válido");
            }
        })
    });

    app.post('/user/delete', function (req, res) {
        let idsUsers = req.body.idsUser;
        //si es solo un usuario, creamos un array y lo metemos para trabajar con forEach
        if (idsUsers === undefined) {
            res.redirect("/listarUsuarios" +
                "?mensaje=Los usuarios no pudieron eliminarse" + "&tipoMensaje=alert-danger ");
        } else {
            if (!Array.isArray(idsUsers)) {
                let aux = idsUsers;
                idsUsers = [];
                idsUsers.push(aux);
            }

            let criterio = {
                email: {$in: idsUsers}
            };
            let nuevoCriterio = {valid: false};
            gestorBD.deleteUsers(criterio, nuevoCriterio, function (usuarios) {
                if (usuarios == null || usuarios.length === 0) {
                    app.get("logger").error("Los usuarios no pudieron eliminarse");
                    res.redirect("/listarUsuarios" +
                        "?mensaje=Los usuarios no pudieron eliminarse");
                } else {
                    app.get("logger").info("Los usuarios se eliminaron correctamente");
                    res.redirect("/listarUsuarios" +
                        "?mensaje=Los usuarios se eliminaron correctamente");
                }
            });
        }
    });
};
