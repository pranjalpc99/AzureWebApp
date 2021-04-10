console.log('Hello world console!');
var cors = require('cors')
var connect = require('connect');

var app = connect();


//let a = app;

export function hello() {

}

// app.use(function(req, res, next) {
//     //Enabling CORS
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
//     next();
// });