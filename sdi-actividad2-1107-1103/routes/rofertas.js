module.exports = function (app, swig, gestorBD) {
    app.get('/oferta/comprar/:id', function (req, res) {
        var ofertaId = gestorBD.mongo.ObjectID(req.params.id);
        gestorBD.restarDinero(ofertaId, req.session.user.email, function (dineroActual) {
            if (dineroActual == null) {
                app.get("logger").info('El usuario no tiene dinero');
                res.redirect("/tienda?mensaje=Error al comprar");
            } else if (dineroActual < 0) {
                app.get("logger").info('El dinero es negativo');
                res.redirect("/tienda?mensaje=No tienes suficiente dinero");
            } else {
                var criterio = {"_id": ofertaId};
                gestorBD.obtenerOfertas(criterio, function (ofertas) {
                    if (ofertas == null) {
                        app.get("logger").info('La oferta no existe');
                        res.redirect("/tienda?mensaje=La oferta no existe");
                    } else {
                        gestorBD.sumarDinero(ofertaId, ofertas[0].propietario, function (dineroPropietario) {
                            if (dineroPropietario == null) {
                                app.get("logger").info('Error al comprar');
                                res.redirect("/tienda?mensaje=Error al comprar");
                            } else {
                                gestorBD.insertarCompra(ofertaId, req.session.user.email, function (idCompra) {
                                    if (idCompra == null) {
                                        app.get("logger").info('Error al comprar');
                                        res.redirect("/tienda?mensaje=Error al comprar");
                                    } else {
                                        req.session.user.dinero = dineroActual;
                                        app.get("logger").info('Usuario redirigido a Compras');
                                        res.redirect("/compras");
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
    app.get('/compras', function (req, res) {
        var criterio = {"comprador": req.session.user.email};
        gestorBD.obtenerOfertas(criterio, function (compras) {
            if (compras == null) {
                app.get("logger").info('Error al listar');
                res.send("Error al listar ");
            } else {
                var respuesta = swig.renderFile('views/bcompras.html',
                    {
                        user: req.session.user,
                        ofertas: compras
                    });
                app.get("logger").info('Usuario dirigido a la lista de compras');
                res.send(respuesta);
            }
        });
    });


    app.get('/ofertas/agregar', function (req, res) {
        var respuesta = swig.renderFile('views/bagregar.html', {user: req.session.user});
        app.get("logger").info('Usuario dirigido a la vista de agregar ofertas');

        res.send(respuesta);
    });

    app.get('/oferta/:id', function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                app.get("logger").info('Error al listar ofertas');
                res.send(respuesta);
            } else {
                var respuesta = swig.renderFile('views/boferta.html',
                    {
                        user: req.session.user,
                        oferta: ofertas[0]
                    });
                app.get("logger").info('Usuario dirigido a la lista de ofertas');
                res.send(respuesta);
            }
        });
    });
    app.post("/oferta", function (req, res) {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();
            let dateString = mm + '/' + dd + '/' + yyyy;
            let oferta = {
                nombre: req.body.nombre,
                detalles: req.body.detalles,
                precio: req.body.precio,
                destacada: (req.body.destacada === "on"),
                propietario: req.session.user.email,
                fecha: dateString
            };
            if (oferta.destacada && req.session.user.dinero < 20) {
                app.get("logger").info('El usuario no dispone de suficiente dinero');
                res.redirect("/ofertas/agregar?mensaje=No tienes suficiente dinero para destacar la oferta");
            } else if (oferta.nombre === null || oferta.nombre === undefined || oferta.nombre === '' ||
                oferta.detalles === null || oferta.detalles === undefined || oferta.detalles === '' ||
                oferta.precio === null || oferta.precio === undefined || oferta.precio <= 0) {
                app.get("logger").info('Los campos introducidos no son válidos');
                res.redirect("/ofertas/agregar?mensaje=Los campos no son validos");
            } else if (isNaN(oferta.precio)) {
                app.get("logger").info('El precio es incorrecto');
                res.redirect("/ofertas/agregar?mensaje=El valor del precio debe ser numérico");
            } else {
                gestorBD.insertarOferta(oferta, function (id) {
                    if (id == null) {
                        app.get("logger").info('Error al añadir la oferta');
                        res.redirect("/publicaciones?mensaje=Error al añadir oferta");
                    } else {
                        if (oferta.destacada) {
                            gestorBD.usuarioDestaca({"email": req.session.user.email}, function (result) {
                                if (result == null) {
                                    app.get("logger").info('Error al destacar la oferta');
                                    res.redirect("/publicaciones" +
                                        "?mensaje=Error destacando la oferta" +
                                        "&tipoMensaje=alert-danger ");
                                } else {
                                    req.session.user.dinero -= 20;
                                    app.get("logger").info('Usuario dirigido a la lista de publicaciones');
                                    res.redirect("/publicaciones?mensaje=Nueva oferta añadida");
                                }
                            });
                        } else {
                            app.get("logger").info('Usuario dirigido a la lista de publicaciones');
                            res.redirect("/publicaciones?mensaje=Nueva oferta añadida");
                        }
                    }
                });
            }
        }
    )
    ;

    app.get("/tienda", function (req, res) {
        let criterio = {
            propietario: {
                $ne: req.session.user.email
            }
        };
        if (req.query.busqueda != null) {
            //var word = "/^" + req.query.busqueda + "$/";
            var word = req.query.busqueda;
            criterio = {
                nombre: {$regex: new RegExp(word, "i")},
                propietario: {
                    $ne: req.session.user.email
                }
            };
        }
        var pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerOfertasPg(criterio, criterio, pg, function (ofertas, total) {
            if (ofertas == null) {
                res.send("Error al listar ");
            } else {
                var ultimaPg = total / 5;
                if (total % 5 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }
                var paginas = []; // paginas mostrar
                for (var i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }
                var respuesta = swig.renderFile('views/btienda.html',
                    {
                        user: req.session.user,
                        ofertas: ofertas,
                        paginas: paginas,
                        actual: pg,
                        busqueda: req.query.busqueda
                    });
                res.send(respuesta);
            }
        });
    });

    app.get("/home", function (req, res) {
        let criterio = {
            propietario: {
                $ne: req.session.user.email
            },
            destacada: true
        };
        var pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerOfertasPg(criterio, criterio, pg, function (ofertas, total) {
            if (ofertas == null) {
                res.send("Error al listar ");
            } else {
                var ultimaPg = total / 5;
                if (total % 5 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }
                var paginas = []; // paginas mostrar
                for (var i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }
                var respuesta = swig.renderFile('views/bhome.html',
                    {
                        user: req.session.user,
                        ofertas: ofertas,
                        paginas: paginas,
                        actual: pg,
                        busqueda: req.query.busqueda
                    });
                res.send(respuesta);
            }
        });
    });

    app.post('/cancion/modificar/:id', function (req, res) {
        var id = req.params.id;
        var criterio = {"_id": gestorBD.mongo.ObjectID(id)};
        var cancion = {
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio: req.body.precio
        }
        if (req.body == null || req.genero == null || req.precio == null) {
            res.redirect("/publicaciones" +
                "?mensaje=Los datos proporcionados no son validos" +
                "&tipoMensaje=alert-danger ");
        } else {
            if (req.body === '' || req.genero === '' || req.precio === '') {
                res.redirect("/publicaciones" +
                    "?mensaje=Los datos proporcionados no son validos" +
                    "&tipoMensaje=alert-danger ");
            } else {
                gestorBD.modificarCancion(criterio, cancion, function (result) {
                    if (result == null || result.length == 0) {
                        res.redirect("/publicaciones" +
                            "?mensaje=La cancion que se quiere modificar no existe" +
                            "&tipoMensaje=alert-danger ");
                    } else {
                        paso1ModificarPortada(req.files, id, function (result) {
                            if (result == null) {
                                res.redirect("/publicaciones" +
                                    "?mensaje=Error en la modificacion" +
                                    "&tipoMensaje=alert-danger ");
                            } else {
                                res.send("Modificado");
                            }
                        });

                    }
                });
            }
        }
    });


    app.get("/publicaciones", function (req, res) {
        var criterio = {propietario: req.session.user.email};
        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                res.send("Error al listar ");
            } else {
                var respuesta = swig.renderFile('views/bpublicacionespropias.html',
                    {
                        user: req.session.user,
                        ofertas: ofertas
                    });
                res.send(respuesta);
            }
        });
    });

    app.get('/oferta/eliminar/:id', function (req, res) {
        if (req.params.id === null || req.params.id === undefined || req.params.id === '') {
            res.redirect("/publicaciones" +
                "?mensaje=Error al eliminar la publicacion" +
                "&tipoMensaje=alert-danger ");
        } else {
            var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
            gestorBD.eliminarOferta(criterio, function (canciones) {
                if (canciones == null) {
                    res.redirect("/publicaciones" +
                        "?mensaje=Error al eliminar la publicacion" +
                        "&tipoMensaje=alert-danger ");
                } else {
                    res.redirect("/publicaciones");
                }
            });
        }
    });

    app.get('/oferta/destacar/:id', function (req, res) {
        gestorBD.obtenerOfertas({_id: req.params.id}, function (ofe) {
            if (req.params.id === null || req.params.id === undefined || req.params.id === '') {
                res.redirect("/publicaciones" +
                    "?mensaje=El valor de la oferta no es valido" +
                    "&tipoMensaje=alert-danger ");
            } else {
                var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
                if (req.session.user.dinero < 20) {
                    res.redirect("/publicaciones" +
                        "?mensaje=No tienes suficiente dinero, necesitas 20€" +
                        "&tipoMensaje=alert-danger ");
                } else {
                    gestorBD.destacarOferta(criterio, function (ofertas) {
                        if (ofertas == null) {
                            res.redirect("/publicaciones" +
                                "?mensaje=No se puede destacar esta publicacion" +
                                "&tipoMensaje=alert-danger ");
                        } else {
                            gestorBD.usuarioDestaca({"email": req.session.user.email}, function (result) {
                                if (result == null) {
                                    res.redirect("/publicaciones" +
                                        "?mensaje=Error destacando la oferta" +
                                        "&tipoMensaje=alert-danger ");
                                } else {
                                    req.session.user.dinero -= 20;
                                    res.redirect("/publicaciones" +
                                        "?mensaje=Publicacion destacada" +
                                        "&tipoMensaje=alert-success ");
                                }
                            });
                        }
                    });
                }
            }
        });
    });
};