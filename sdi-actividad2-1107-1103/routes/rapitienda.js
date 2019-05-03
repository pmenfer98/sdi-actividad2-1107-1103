module.exports = function (app, gestorBD) {
    let moment = app.get('moment');
    moment.locale('es');
    app.get("/api/oferta", function (req, res) {
        let criterioMongo = {
            propietario: {
                $ne: res.usuario
            }
        };

        gestorBD.obtenerOfertas(criterioMongo, function (ofertas) {
            if (ofertas == null) {
                res.status(500);
                app.get("logger").error("(API) Se ha producido un error al obtener las ofertas");
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                app.get("logger").info('(API) Se muestra la lista de ofertas');
                res.send(JSON.stringify(ofertas));
            }
        });
    });

    app.get("/api/oferta/:id", function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                res.status(500);
                app.get("logger").error("(API) Se ha producido un error al obtener las ofertas");
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                app.get("logger").info('(API) Se muestra la oferta indicada');
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
                app.get("logger").error("(API) Se ha producido un error al obtener los usuarios");
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
                app.get("logger").info('(API) El usuario se ha autenticado');
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
                app.get("logger").error("(API) Se ha producido un error al obtener las ofertas");
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                let oferta = ofertas[0];
                let mensaje = {
                    emisor: res.usuario,
                    receptor: req.body.receptor,
                    oferta: oferta,
                    mensaje: req.body.mensaje,
                    fecha: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    leido: false
                };
                gestorBD.insertarMensaje(mensaje, function (mensajes) {
                    if (mensajes == null) {
                        res.status(500);
                        app.get("logger").error("(API) Se ha producido un error al insertar los mensajes");
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        app.get("logger").info('(API) Se muestra la lista de mensajes para la oferta indicada');
                        res.send(JSON.stringify(mensajes));
                    }
                })
            }
        })
    });

    app.get("/api/conversacion/oferta/:id/:receptor", function (req, res) {
        let criterioMongo = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerOfertas(criterioMongo, function (ofertas) {
            if (ofertas == null) {
                res.status(500);
                app.get("logger").error("(API) Oferta no encontrada");
                res.json({
                    error: "se ha producido un error"
                })
            } else if (ofertas.length === 0) {
                res.status(400);
                app.get("logger").error("(API) Oferta no encontrada");
                res.json({
                    error: "Oferta no encontrada"
                })
            } else {
                let oferta = ofertas[0];
                let propietario = req.params.receptor;
                let usuario = res.usuario;
                let criterio = {
                    $or: [
                        {
                            $and: [
                                {
                                    emisor: usuario
                                },
                                {
                                    receptor: propietario
                                },
                                {
                                    oferta: oferta
                                }
                            ]
                        },
                        {
                            $and: [
                                {
                                    emisor: propietario
                                },
                                {
                                    receptor: usuario
                                },
                                {
                                    oferta: oferta
                                }
                            ]
                        }
                    ]
                };
                gestorBD.obtenerMensajes(criterio, function (mensajes) {
                    if (mensajes == null) {
                        res.status(500);
                        app.get("logger").error("(API) Se ha producido un error al obtener los mensajes");
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        app.get("logger").info('(API) Se muestra la conversación indicada');
                        res.send(JSON.stringify(mensajes));
                    }
                });
            }
        });
    });

    app.get("/api/conversaciones", function (req, res) {
        let criterioMensajes = {$or:[{emisor: res.usuario}, {receptor: res.usuario}]};
        gestorBD.obtenerConversaciones(criterioMensajes, function (ofertas) {
            if (ofertas == null) {
                res.status(500);
                app.get("logger").error("(API) Se ha producido un error al listar las conversaciones");
                res.json({
                    error: "se ha producido un error"
                })
            } else if (ofertas.length === 0) {
                res.status(400);
                app.get("logger").error("(API) Oferta no encontrada");
                res.json({
                    error: "Oferta no encontrada"
                })
            } else {
                app.get("logger").info('(API) Se muestra la lista de conversaciones');
                res.send(JSON.stringify(ofertas));
            }
        });
    });

    app.get("/api/mensaje/leido/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.marcarMensajeComoLeido(criterio, function (mensajes) {
            if (mensajes == null) {
                res.status(500);
                app.get("logger").error("(API) Se ha producido un error al listar los mensajes");
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                app.get("logger").info('(API) Se marcan los mensajes como leídos');
                res.send(JSON.stringify(mensajes));
            }
        })
    });

    app.get("/api/mensaje/eliminar/:id", function (req, res) {
        let criterioMongo = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerOfertas(criterioMongo, function (ofertas) {
            if (ofertas == null) {
                res.status(500);
                app.get("logger").error("(API) Se ha producido un error al eliminar los mensajes");
                res.json({
                    error: "se ha producido un error"
                })
            } else if (ofertas.length === 0) {
                res.status(400);
                app.get("logger").error("(API)Se ha producido un error al buscar la oferta");
                res.json({
                    error: "Oferta no encontrada"
                })
            } else {
                let oferta = ofertas[0];
                let propietario = oferta.propietario;
                let usuario = res.usuario;
                let criterio = {
                    $or: [
                        {
                            $and: [
                                {
                                    emisor: usuario
                                },
                                {
                                    receptor: propietario
                                }
                            ]
                        },
                        {
                            $and: [
                                {
                                    emisor: propietario
                                },
                                {
                                    receptor: usuario
                                }
                            ]
                        }
                    ]
                };
                gestorBD.eliminarMensajes(criterio, function (mensajes) {
                    if (mensajes == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        app.get("logger").info('(API) Se eliminan los mensajes señalados');
                        res.send(JSON.stringify(mensajes));
                    }
                });
            }
        });
    });

    app.get("/api/conversaciones/eliminar/:id/:propietario/:comprador", function (req, res) {
        let idOferta = gestorBD.mongo.ObjectID(req.params.id);
        let criterioMongo = {
            $or: [
                {
                    $and: [
                        {
                            emisor: req.params.propietario
                        },
                        {
                            receptor: req.params.comprador
                        },
                        {
                            oferta: {_id: idOferta}
                        }
                    ]
                },
                {
                    $and: [
                        {
                            emisor: req.params.comprador
                        },
                        {
                            receptor: req.params.propietario
                        },
                        {
                            oferta: {_id: idOferta}
                        }
                    ]
                }
            ]};
        gestorBD.obtenerMensajes(criterioMongo, function (mensajes) {
            if (mensajes == null) {
                res.status(500);
                app.get("logger").error("(API) Se ha producido un error al obtener los mensajes");
                res.json({
                    error: "se ha producido un error"
                })
            } else if (mensajes.length === 0) {
                console.log("BORRADO");
                console.log("BORRADO");
                console.log("BORRADO");
                console.log("BORRADO");
                console.log("BORRADO");
                console.log("BORRADO");
                console.log(req.params.propietario);
                console.log(req.params.comprador);
                console.log(idOferta);
                res.status(400);
                app.get("logger").error("(API) Se ha producido un error al obtener las ofertas");
                res.json({
                    error: "Oferta no encontrada"
                })
            } else {
                gestorBD.eliminarMensajes(criterioMongo, function (mensajes) {
                    if (mensajes == null) {
                        res.status(500);
                        app.get("logger").error("(API) Se ha producido un error al eliminar los mensajes");
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        app.get("logger").info('(API) Se eliminan los mensajes señalados');
                        res.send(JSON.stringify(mensajes));
                    }
                });
            }
        });
    });

};