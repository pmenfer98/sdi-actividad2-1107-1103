var express = require('express');
var app = express();

var mongo = require('mongodb');
var swig = require('swig-templates');
var crypto = require('crypto');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', 8081);
app.set('db', 'mongodb://pablo:sdi@sdi-actividad2-1107-1103-shard-00-00-fj6ok.mongodb.net:27017,sdi-actividad2-1107-1103-shard-00-01-fj6ok.mongodb.net:27017,sdi-actividad2-1107-1103-shard-00-02-fj6ok.mongodb.net:27017/test?ssl=true&replicaSet=sdi-actividad2-1107-1103-shard-0&authSource=admin&retryWrites=true');
app.set('clave','abcdefg');
app.set('crypto', crypto);
app.set('usuario', null);


var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rcanciones.js")(app, swig, gestorBD);

app.get('/', function (req, res) {
    res.redirect('/registrarse');
});

// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});