// express dependencies
const express = require('express');
const morgan = require('morgan');
const app = express();
const fs = require("fs");
// https server
const https = require("https");

// settings (testing and dev):
// app.set( 'port', process.env.PORT || process.env.port || 3002 );
// settings for PROD:
// app.set( 'port', process.env.PORT || process.env.port || 80 );
app.set( 'port', process.env.PORT || process.env.port || 443 );
app.set('json spaces', 2);

// middlewares
app.use(morgan('dev'));
app.use(express.json()); // para soportar formatos json por parte de mi servidor
app.use(express.urlencoded({extended: false})); // para soportar formularios
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ROUTES
app.use('/api/cronCreator', require("./routes/cronCreator"));

// serve the API with signed certificate on 443 (SSL/HTTPS) port
const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/intevolution-vmubuntu20.southcentralus.cloudapp.azure.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/intevolution-vmubuntu20.southcentralus.cloudapp.azure.com/fullchain.pem'),
}, app);


httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});


/*
app.listen( app.get('port'), () => {
    console.log(`Ejemplo de una aplicación escuchando en el puerto ${app.get('port')}\n`);
});
*/
