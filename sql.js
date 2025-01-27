var mysql = require('mysql');
var config = require('./config')


var mysql = require('mysql');

var con = mysql.createConnection({
  host: config.sqlHost,
  user: config.sqlUser,
  password: config.sqlPass
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});