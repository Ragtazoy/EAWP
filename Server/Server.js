const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

app.use(cors())
app.use(bodyParser.json())

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   database: 'test'
});

// Read
app.get('/api', function (req, res, next) {
   db.query(
      'SELECT * FROM testbase',
      function (err, results, fields) {
         res.json(results)
      }
   );
})

app.get('/api/employee', function (req, res, next) {
   db.query(
      'SELECT * FROM employee',
      function (err, results, fields) {
         console.log(results)
         res.json(results)
      }
   );
})

app.get('/api/employee/:id', function (req, res, next) {
   const emp_id = req.params.id
   db.query(
      'SELECT * FROM employee WHERE emp_id = ?',
      [emp_id],
      function (err, results, fields) {
         res.json(results)
      }
   );
})


// Create
app.post('/create/emp', (req, res) => {
   const nname = req.body.nname
   const password = req.body.password
   const job_title = req.body.job_title
   const dept = req.body.dept
   const job_start = req.body.job_start
   const fname = req.body.fname
   const lname = req.body.lname
   const birthdate = req.body.birthdate
   const phone = req.body.phone
   const line_account = req.body.line_account
   
   const sql = "INSERT INTO `employee` (`emp_id`, `line_account`, `password`, `fname`, `lname`, `nname`, `phone`, `job_title`, `job_start`, `birthdate`, `dept`) VALUES (NULL,?,?,?,?,?,?,?,?,?,?)"
   const values = [line_account, password, fname, lname, nname, phone, job_title, job_start, birthdate, dept];

   db.query(sql, values, (err, results) => {
      if (err) {
         console.log('error!!!:' + err);
      } else {
         res.send(results)
      }
   }
   )
});

app.post('/create', (req, res, next) => {
   // const { nname, password } = req.body;
   const n_name = req.body.n_name
   const password = req.body.password
   const sql = `INSERT INTO employee (username, password) VALUES (?, ?)`;
   const values = [n_name, password];
   db.connect();
   db.query(sql, values, (err, results, fields) => {
      if (err) {
         console.log('error!!!!:' + err);
         throw err;
      } else {
         // res.send('Values inserted')
         res.send(results);
      }
   });
   db.end();
});

app.listen(81, function () {
   console.log('CORS-enabled web server listening on port 81')
});