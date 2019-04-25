module.exports = function (app, swig, gestorBD) {
    app.get("/nuevas/canciones", function (req, res) {
        var canciones = [{
            "nombre": "Blank space",
            "precio": "1.2"
        }, {
            "nombre": "See you again",
            "precio": "1.3"
        }, {
            "nombre": "Uptown Funk",
            "precio": "1.1"
        }];
        var respuesta = swig.renderFile('views/btienda.html', {
            vendedor: 'Tienda de canciones',
            canciones: canciones
        });
        res.send(respuesta);

    });

    app.get('/oferta/comprar/:id', function (req, res) {
        var ofertaId = gestorBD.mongo.ObjectID(req.params.id);
        gestorBD.restarDinero(ofertaId, req.session.user.email, function (dineroActual) {
            if (dineroActual == null) {
                res.redirect("/tienda?mensaje=Error al comprar");
            } else if (dineroActual < 0) {
                res.redirect("/tienda?mensaje=No tienes suficiente dinero");
            } else {
                var criterio = {"_id": ofertaId};
                gestorBD.obtenerOfertas(criterio, function (ofertas) {
                    if (ofertas == null) {
                        res.redirect("/tienda?mensaje=La oferta no existe");
                    } else {
                        gestorBD.sumarDinero(ofertaId, ofertas[0].propietario, function (dineroPropietario) {
                            if (dineroPropietario == null) {
                                res.redirect("/tienda?mensaje=Error al comprar");
                            } else {
                                gestorBD.insertarCompra(ofertaId, req.session.user.email, function (idCompra) {
                                    if (idCompra == null) {
                                        res.redirect("/tienda?mensaje=Error al comprar");
                                    } else {
                                        req.session.user.dinero = dineroActual;
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
                res.send("Error al listar ");
            } else {
                console.log("Compras encontradas: " + compras.length);
                var respuesta = swig.renderFile('views/bcompras.html',
                    {
                        user: req.session.user,
                        ofertas: compras
                    });
                res.send(respuesta);
            }
        });
    });


    app.get('/ofertas/agregar', function (req, res) {
        var respuesta = swig.renderFile('views/bagregar.html', {user: req.session.user});
        res.send(respuesta);
    })

    app.get('/suma', function (req, res) {
        var respuesta = parseInt(req.query.num1) + parseInt(req.query.num2);
        res.send(String(respuesta));
    });

    app.get('/oferta/:id', function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                res.send(respuesta);
            } else {
                var respuesta = swig.renderFile('views/boferta.html',
                    {
                        user: req.session.user,
                        oferta: ofertas[0]
                    });
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
                res.redirect("/ofertas/agregar?mensaje=No tienes suficiente dinero para destacar la oferta");
            } else if (oferta.nombre === null || oferta.nombre === undefined || oferta.nombre === '' ||
                oferta.detalles === null || oferta.detalles === undefined || oferta.detalles === '' ||
                oferta.precio === null || oferta.precio === undefined || oferta.precio <= 0) {
                res.redirect("/ofertas/agregar?mensaje=Los campos no son validos");
            } else if (isNaN(oferta.precio)) {
                res.redirect("/ofertas/agregar?mensaje=El valor del precio debe ser numerico");
            } else {
                gestorBD.insertarOferta(oferta, function (id) {
                    if (id == null) {
                        res.redirect("/publicaciones?mensaje=Error al añadir oferta");
                    } else {
                        if (oferta.destacada) {
                            gestorBD.usuarioDestaca({"email": req.session.user.email}, function (result) {
                                if (result == null) {
                                    res.redirect("/publicaciones" +
                                        "?mensaje=Error destacando la oferta" +
                                        "&tipoMensaje=alert-danger ");
                                } else {
                                    req.session.user.dinero -= 20;
                                    res.redirect("/publicaciones?mensaje=Nueva oferta añadida");
                                }
                            });
                        } else {
                            res.redirect("/publicaciones?mensaje=Nueva oferta añadida");
                        }
                    }
                });
            }
        }
    )
    ;

    app.get('/canciones/:genero/:id', function (req, res) {
        var respuesta = 'id: ' + req.params.id + '<br>'
            + 'Genero: ' + req.params.genero;
        res.send(respuesta);
    });

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
        console.log("Objeto busqueda " + req.query.busqueda);
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


    app.get('/cancion/modificar/:id', function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerOfertas(criterio, function (canciones) {
            if (canciones == null) {
                res.send(respuesta);
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto" +
                    "&tipoMensaje=alert-danger ");
            } else {
                var respuesta = swig.renderFile('views/bcancionModificar.html',
                    {
                        cancion: canciones[0]
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


}
;

function paso1ModificarPortada(files, id, callback) {
    if (files.portada != null) {
        var imagen = files.portada;
        imagen.mv('public/portadas/' + id + '.png', function (err) {
            if (err) {
                callback(null); // ERROR
            } else {
                paso2ModificarAudio(files, id, callback); // SIGUIENTE
            }
        });
    } else {
        paso2ModificarAudio(files, id, callback); // SIGUIENTE
    }
};

function paso2ModificarAudio(files, id, callback) {
    if (files.audio != null) {
        var audio = files.audio;
        audio.mv('public/audios/' + id + '.mp3', function (err) {
            if (err) {
                callback(null); // ERROR
            } else {
                callback(true); // FIN
            }
        });
    } else {
        callback(true); // FIN
    }
};