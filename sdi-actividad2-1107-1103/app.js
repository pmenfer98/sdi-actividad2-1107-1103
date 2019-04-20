var express = require('express');
var app = express();

var mongo = require('mongodb');
var swig = require('swig-templates');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('port', 8081);
app.set('db', 'mongodb://pablo:sdi@sdi-actividad2-1107-1103-shard-00-00-fj6ok.mongodb.net:27017,sdi-actividad2-1107-1103-shard-00-01-fj6ok.mongodb.net:27017,sdi-actividad2-1107-1103-shard-00-02-fj6ok.mongodb.net:27017/test?ssl=true&replicaSet=sdi-actividad2-1107-1103-shard-0&authSource=admin&retryWrites=true');
app.set('clave','abcdefg');
app.set('crypto', crypto);


var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

var routerUserSession = express.Router();
routerUserSession.use(function (req, res, next) {
    if (req.session.user != null || req.session.user != undefined) { // dejamos correr la petición
        if (req.session.user.email === app.get('current_user')) { // dejamos correr la petición
            next();
        } else {
            res.redirect("/desconectarse" +
                "?mensaje=El usuario actual no corresponde con el usuario de la peticion" +
                "&tipoMensaje=alert-danger ");
        }
    } else {
        res.redirect("/identificarse");
    }
});

var routerUserLogged = express.Router();
routerUserLogged.use(function (req, res, next) {
    if (req.session.user == null || req.session.user == undefined) { // dejamos correr la petición
        next();
    } else {
        res.redirect("/publicaciones");
    }
});

var routerAdmin = express.Router();
routerAdmin.use(function (req, res, next) {
    if (req.session.user.rol === 'admin' && req.session.user.email === 'admin@email.com') { // dejamos correr la petición
        next();
    } else {
        res.redirect("/desconectarse?mensaje=Debes ser administrador para acceder a esta opcion");
    }
});

var routerUser = express.Router();
routerUser.use(function (req, res, next) {
    if (req.session.user.rol === 'user') { // dejamos correr la petición
        next();
    } else {
        res.redirect("/desconectarse?mensaje=Debes ser usuario estandar para acceder a esta opcion");
    }
});

app.use('/identificarse', routerUserLogged);
app.use('/registrarse', routerUserLogged);
app.use('/usuario', routerUserLogged);

app.use('/publicaciones', routerUserSession);
app.use('/ofertas/agregar', routerUserSession);
app.use('/oferta', routerUserSession);
app.use('/listarUsuarios', routerUserSession);
app.use('/oferta/eliminar/:id', routerUserSession);
app.use('/tienda', routerUserSession);
app.use('/oferta/comprar/:id', routerUserSession);
app.use('/compras', routerUserSession);
app.use('/oferta/:id', routerUserSession);

app.use('/listarUsuarios', routerAdmin);

app.use('/publicaciones', routerUser);
app.use('/ofertas/agregar', routerUser);
app.use('/oferta', routerUser);
app.use('/oferta/eliminar/:id', routerUser);
app.use('/tienda', routerUser);
app.use('/oferta/comprar/:id', routerUser);
app.use('/compras', routerUser);
app.use('/oferta/:id', routerUser);


require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rofertas.js")(app, swig, gestorBD);


app.get('/', function (req, res) {
    res.redirect('/identificarse');
});

// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});