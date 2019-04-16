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
        next();
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

app.use('/identificarse', routerUserLogged);
app.use('/registrarse', routerUserLogged);
app.use('/publicaciones', routerUserSession);
app.use('/listarUsuarios', routerUserSession);

require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rcanciones.js")(app, swig, gestorBD);


app.get('/', function (req, res) {
    res.redirect('/identificarse');
});

// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});