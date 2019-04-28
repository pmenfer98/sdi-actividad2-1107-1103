module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    obtenerUsuarios: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.find(criterio).toArray(function (err, usuarios) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },
    modificarCancion: function (criterio, cancion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('canciones');
                collection.update(criterio, {$set: cancion}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    insertarUsuario: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.insert(usuario, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                        console.log("Usuario añadido")
                    }
                    db.close();
                });
            }
        });
    },
    obtenerOfertas: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertas');
                collection.find(criterio).toArray(function (err, canciones) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(canciones);
                    }
                    db.close();
                });
            }
        });
    },
    eliminarOferta: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertas');
                collection.remove(criterio, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    usuarioDestaca: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var usuarios = db.collection('usuarios');
                usuarios.find(criterio).toArray(function (err, resultado) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        var dinero = Number.parseFloat(resultado[0].dinero);
                        resultado[0].dinero -= 20;
                        var money = {$set: resultado[0]};
                        console.log(money);
                        usuarios.update({email: resultado[0].email}, money, function (err, result) {
                            if (err) {
                                console.log(err);
                                funcionCallback(null);
                            } else {
                                funcionCallback(result);
                            }
                            db.close();
                        });
                    }
                });
            }

        });
    },
    destacarOferta: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertas');
                collection.update(criterio, {$set: {destacada: true}}, function (err, resultado) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(resultado);
                    }
                });
            }
            db.close();
        });
    }
    ,
    insertarCompra: function (compraID, email, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var criterio = {"_id": compraID};
                var collection = db.collection('ofertas');
                collection.find(criterio).toArray(function (err, results) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        collection.update(results[0], {$set: {comprador: email}}, function (err, result) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(result);
                            }
                            db.close();
                        });
                    }
                    db.close();
                });
            }
        });
    }
    ,
    obtenerOfertasPg: function (criterio, criterioContar, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertas');

                collection.count(criterioContar, function (err, count) {
                    collection.find(criterio).sort({"destacada": -1}).skip((pg - 1) * 5).limit(5)
                        .toArray(function (err, canciones) {
                            if (err) {
                                console.log(err);
                                funcionCallback(null);
                            } else {
                                console.log(count);
                                funcionCallback(canciones, count);
                            }
                            db.close();
                        });
                });
            }
        });
    }
    ,
    restarDinero: function (ofertaId, email, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertas');
                var criterio = {"_id": ofertaId};
                collection.find(criterio).toArray(function (err, ofertas) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        var precioOferta = ofertas[0].precio;
                        collection = db.collection('usuarios');
                        criterio = {"email": email};
                        collection.find(criterio).toArray(function (err, usuarios) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                var dineroUsuario = usuarios[0].dinero;
                                console.log("Dinero del usuario: " + dineroUsuario);
                                console.log("Dinero del oferta: " + precioOferta);
                                if (dineroUsuario == null || precioOferta == null) {
                                    funcionCallback(null);
                                } else {
                                    var dineroFinal = dineroUsuario - precioOferta;
                                    if (dineroFinal < 0) {
                                        funcionCallback(dineroFinal);
                                    } else {
                                        collection.update(criterio, {$set: {dinero: dineroFinal}}, function (err, result) {
                                            if (err) {
                                                funcionCallback(null);
                                            } else {
                                                funcionCallback(dineroFinal);
                                            }
                                            db.close();
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    ,
    sumarDinero: function (ofertaId, email, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertas');
                var criterio = {"_id": ofertaId};
                collection.find(criterio).toArray(function (err, ofertas) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        var precioOferta = ofertas[0].precio;
                        collection = db.collection('usuarios');
                        criterio = {"email": email};
                        collection.find(criterio).toArray(function (err, usuarios) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                var dineroUsuario = usuarios[0].dinero;
                                if (dineroUsuario == null || precioOferta == null) {
                                    funcionCallback(null);
                                } else {
                                    var dineroFinal = Number.parseFloat(dineroUsuario) + Number.parseFloat(precioOferta);
                                    if (dineroFinal < 0) {
                                        funcionCallback(dineroFinal);
                                    } else {
                                        collection.update(criterio, {$set: {dinero: dineroFinal}}, function (err, result) {
                                            if (err) {
                                                funcionCallback(null);
                                            } else {
                                                funcionCallback(dineroFinal);
                                            }
                                            db.close();
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    ,
    insertarOferta: function (oferta, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertas');
                collection.insert(oferta, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    deleteUsers: function (usuarios, usuariosActualizados, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.updateMany(usuarios, {
                    $set: usuariosActualizados
                }, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },

    insertarMensaje: function (mensaje, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('mensajes');
                collection.insert(mensaje, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]);
                        console.log("Mensaje añadido")
                    }
                    db.close();
                });
            }
        });
    },
};