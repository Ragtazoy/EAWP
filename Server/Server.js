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
    //   res.json({msg: 'This is CORS-enabled for all origins!'})
    connection.query(
        'SELECT * FROM testbase',
        function (err, results, fields) {
            //   console.log(results); // results contains rows returned by server
            //   console.log(fields); // fields contains extra meta data about results, if available
            res.json( results )
        }
    );
})

app.listen(81, function () {
    console.log('CORS-enabled web server listening on port 81')
})