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

    app.get('/cancion/comprar/:id', function (req, res) {
        var cancionId = gestorBD.mongo.ObjectID(req.params.id);
        var compra = {
            usuario: req.session.usuario,
            cancionId: cancionId
        }
        gestorBD.insertarCompra(compra, function (idCompra) {
            if (idCompra == null) {
                res.send(respuesta);
            } else {
                res.redirect("/compras");
            }
        });
    });

    app.get('/compras', function (req, res) {
        var criterio = {"usuario": req.session.usuario};
        gestorBD.obtenerCompras(criterio, function (compras) {
            if (compras == null) {
                res.send("Error al listar ");
            } else {
                var cancionesCompradasIds = [];
                for (i = 0; i < compras.length; i++) {
                    cancionesCompradasIds.push(compras[i].cancionId);
                }
                var criterio = {"_id": {$in: cancionesCompradasIds}}
                gestorBD.obtenerMisOfertas(criterio, function (canciones) {
                    var respuesta = swig.renderFile('views/bcompras.html',
                        {
                            canciones: canciones
                        });
                    res.send(respuesta);
                });
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

    app.get('/cancion/:id', function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerMisOfertas(criterio, function (canciones) {
            if (canciones == null) {
                res.send(respuesta);
            } else {
                var respuesta = swig.renderFile('views/bcancion.html',
                    {
                        cancion: canciones[0]
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
            propietario: req.session.user.email,
            fecha: dateString
        };
        if (oferta.nombre === null || oferta.nombre === undefined || oferta.nombre === '' ||
            oferta.detalles === null || oferta.detalles === undefined || oferta.detalles === '' ||
            oferta.precio === null || oferta.precio === undefined || oferta.precio <= 0) {
            res.redirect("/ofertas/agregar?mensaje=Los campos no son validos");
        } else {
            gestorBD.insertarOferta(oferta, function (id) {
                if (id == null) {
                    res.redirect("/publicaciones?mensaje=Error al añadir oferta");
                } else {
                    res.redirect("/publicaciones?mensaje=Nueva oferta añadida");
                }
            });
        }

    });

    app.get('/canciones/:genero/:id', function (req, res) {
        var respuesta = 'id: ' + req.params.id + '<br>'
            + 'Genero: ' + req.params.genero;
        res.send(respuesta);
    });
    app.get("/tienda", function (req, res) {
        var criterio = {};
        if (req.query.busqueda != null) {
            criterio = {"nombre": req.query.busqueda};
        }
        var pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerCancionesPg(criterio, pg, function (canciones, total) {
            if (canciones == null) {
                res.send("Error al listar ");
            } else {
                var ultimaPg = total / 4;
                if (total % 4 > 0) { // Sobran decimales
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
                        canciones: canciones,
                        paginas: paginas,
                        actual: pg
                    });
                res.send(respuesta);
            }
        });
    });

    app.get('/cancion/modificar/:id', function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerMisOfertas(criterio, function (canciones) {
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
        gestorBD.obtenerMisOfertas(criterio, function (ofertas) {
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
        }else{
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


};

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