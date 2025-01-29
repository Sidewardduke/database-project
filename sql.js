var mysql = require('mysql2');
var config = require('./config')

var con = mysql.createConnection({
  host: config.sqlHost,
  user: config.sqlUser,
  password: config.sqlPass
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});