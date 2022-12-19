var express = require('express')
var cors = require('cors')
var app = express()

const mysql = require('mysql2');

const connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   database: 'test'
});

app.use(cors())

app.get('/api', function (req, res, next) {
   connection.query(
      'SELECT * FROM testbase',
      function (err, results, fields) {
         //   console.log(results); // results contains rows returned by server
         //   console.log(fields); // fields contains extra meta data about results, if available
         res.json(results)
      }
   );
})

app.get('/api/employee', function (req, res, next) {
   connection.query(
      'SELECT * FROM employee',
      function (err, results, fields) {
         console.log(results);
         res.json(results)
      }
   );
})

app.get('/api/employee/:id', function (req, res, next) {
   const emp_id = req.params.id
   connection.query(
      'SELECT * FROM employee WHERE emp_id = ?',
      [emp_id],
      function (err, results, fields) {
         res.json(results)
      }
   );
})

app.listen(81, function () {
   console.log('CORS-enabled web server listening on port 81')
})