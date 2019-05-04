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
            }
            else {
                // Antes de añadir un mensaje, compruebas si hay una conversacion existente entre las dos personas
                // Si existe coges el id de esta y se lo añades al mensaje
                // Si no existe la creas y coges id para añadirselo al mensaje
                let oferta = ofertas[0];
                let criterio = {
                    $or: [
                        {
                            $and: [
                                {
                                    emisor: res.usuario
                                },
                                {
                                    receptor: oferta.propietario
                                },
                                {oferta: gestorBD.mongo.ObjectID(req.params.id)}
                            ]
                        },
                        {
                            $and: [
                                {
                                    emisor: oferta.propietario
                                },
                                {
                                    receptor: res.usuario
                                },
                                {oferta: gestorBD.mongo.ObjectID(req.params.id)}
                            ]
                        }
                    ]
                };
                gestorBD.buscarConversaciones(criterio, function (conversaciones) {
                    if (conversaciones.length === 0) {
                        let conversacion = {
                            oferta: gestorBD.mongo.ObjectID(req.params.id),
                            nombreOferta: ofertas[0].nombre,
                            receptor: req.body.receptor,
                            emisor: res.usuario,
                            numMensajesNoLeidos: 0
                        };
                        gestorBD.insertarConversacion(conversacion, function (conversaciones) {
                            if (conversaciones == null) {
                                res.status(500);
                                app.get("logger").error("(API) Se ha producido un error al insertar las conversaciones");
                                res.json({
                                    error: "se ha producido un error"
                                })
                            } else {
                                let mensaje = {
                                    emisor: res.usuario,
                                    receptor: req.body.receptor,
                                    oferta: oferta,
                                    mensaje: req.body.mensaje,
                                    fecha: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
                                    leido: false,
                                    idConversacion: conversaciones._id
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
                                });
                            }
                        })
                    } else if (conversaciones.length > 0) {
                        app.get("logger").info('(API) Se ha insertado una nueva conversacion');
                        let mensaje = {
                            emisor: res.usuario,
                            receptor: req.body.receptor,
                            oferta: oferta,
                            mensaje: req.body.mensaje,
                            fecha: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
                            leido: false,
                            idConversacion: conversaciones[0]._id
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
                        });
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

    app.get("/api/conversacion/nombre/:id", function (req, res) {
        let criterioMensajes = {
            _id: gestorBD.mongo.ObjectID(req.params.id)
        };
        gestorBD.obtenerOfertas(criterioMensajes, function (ofertas) {
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

    app.get("/api/conversaciones", function (req, res) {
        let usuario = res.usuario;
        let criterioMensajes = {
            $or: [
                {
                    emisor: usuario

                },
                {
                    receptor: usuario
                }
            ]
        };
        gestorBD.obtenerConversaciones(criterioMensajes, function (ofertas) {
            if (ofertas == null) {
                res.status(500);
                app.get("logger").error("(API) Se ha producido un error al listar las conversaciones");
                res.json({
                    error: "se ha producido un error"
                });
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

    app.get("/api/conversaciones/eliminar/:id", function (req, res) {
        let idOferta = gestorBD.mongo.ObjectID(req.params.id);
        let criterioMongo = {idConversacion: idOferta};
        let criterioConvers = {_id: idOferta};
        gestorBD.obtenerMensajes(criterioMongo, function (mensajes) {
            if (mensajes == null) {
                res.status(500);
                app.get("logger").error("(API) Se ha producido un error al obtener los mensajes");
                res.json({
                    error: "se ha producido un error"
                })
            } else if (mensajes.length === 0) {
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
                        gestorBD.eliminarConversaciones(criterioConvers, function (mensajes) {
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
            }
        });
    });

    // TODO
    // Terminarlo para que devuelva las conversaciones
    app.get("/api/conversacion/usuario", function (req, res) {
        let usuario = res.usuario;
        let criterio = {
            $or: [
                {receptor: usuario},
                {emisor: usuario}
            ]
        }
    });
};