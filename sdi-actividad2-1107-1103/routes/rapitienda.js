module.exports = function (app, gestorBD) {
    app.get("/api/oferta", function (req, res) {
        let criterioMongo = {
            propietario: {
                $ne: res.usuario
            }
        };

        gestorBD.obtenerOfertas(criterioMongo, function (ofertas) {
            if (ofertas == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(ofertas));
            }
        });
    });


    app.get("/api/oferta/:id", function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(ofertas[0]));
            }
        });
    });


    app.post("/api/autenticar/", function (req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                res.status(401); // Unauthorized
                res.json({
                    autenticado: false
                })
            } else {
                var token = app.get('jwt').sign(
                    {
                        usuario: req.body.email,
                        tiempo: Date.now() / 1000
                    },
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token: token
                })
            }

        });
    });

    app.post("/api/mensaje/oferta/:id", function (req, res) {
            let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
            gestorBD.obtenerOfertas(criterio, function (ofertas) {
                if (ofertas == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(200);
                    res.send(JSON.stringify(ofertas[0]));
                }
            })

            let oferta = ofertas[0];
            let mensaje = {
                emisor: req.user,
                oferta: oferta,
                mensaje: req.body.mensaje,
                fecha: new Date(),
                leido: false
            }
            gestorBD.insertarMensaje(mensaje, function (id) {
                if (id == null) {
                    res.redirect("/registrarse?mensaje=Error al registrar usuario");
                } else {
                    req.session.user = usuario;
                    app.set('current_user', usuario.email);
                    res.redirect("/home");
                }
            })
        });


        app.post("/api/cancion", function (req, res) {
            var cancion = {
                nombre: req.body.nombre,
                genero: req.body.genero,
                precio: req.body.precio,
            }
            gestorBD.insertarOferta(cancion, function (id) {
                if (id == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(201);
                    res.json({
                        mensaje: "canción insertarda",
                        _id: id
                    })
                }
            });

        });


    app.delete("/api/cancion/:id", function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.eliminarOferta(criterio, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones));
            }
        });
    });

    app.put("/api/cancion/:id", function (req, res) {

        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};

        var cancion = {}; // Solo los atributos a modificar
        if (req.body.nombre != null)
            cancion.nombre = req.body.nombre;
        if (req.body.genero != null)
            cancion.genero = req.body.genero;
        if (req.body.precio != null)
            cancion.precio = req.body.precio;
        gestorBD.modificarCancion(criterio, cancion, function (result) {
            if (result == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.json({
                    mensaje: "canción modificada",
                    _id: req.params.id
                })
            }
        });
    });


};