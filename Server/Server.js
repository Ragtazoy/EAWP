const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

app.use(cors())
app.use(bodyParser.json())

const db = mysql.createConnection({
   host: '127.0.0.1',
   user: 'root',
   database: 'eawp_base'
});
//======================================================================================================//

// Read //
app.get('/read/emplist', (req, res) => {
   db.query('SELECT * FROM employee',
      (err, results) => {
         err ? console.log('/read/emplist ' + err) : res.json(results)
      }
   );
})

app.get('/read/dept', (req, res) => {
   db.query('SELECT * FROM department',
      (err, results) => {
         err ? console.log('/read/dept ' + err) : res.json(results)
      }
   );
})

app.get('/read/empdept', (req, res) => {
   db.query('SELECT e.emp_id ,e.nname, e.job_title, d.dept_name FROM employee e JOIN department d WHERE e.emp_id = d.emp_id',
      (err, results) => {
         err ? console.log('/read/empdept ' + err) : res.json(results)
      }
   );
})

app.get('/read/dept/:id', (req, res) => {
   const id = req.params.id
   db.query('SELECT d.dept_name FROM employee e JOIN department d ON e.emp_id = d.emp_id WHERE e.emp_id = ?', [id],
      (err, results) => {
         err ? console.log('/read/dept/:id ' + err) : res.json(results)
      }
   );
})

app.get('/read/empdetail/:id', (req, res) => {
   const id = req.params.id
   db.query(
      'SELECT e.emp_id, e.nname, e.password, e.fname, e.lname, e.job_title, e.job_start, e.phone, e.birthdate, e.line_account, w.job_hours, w.absent_quantity, w.late_quantity, w.leave_quantity FROM employee e JOIN work_history w ON e.emp_id = w.emp_id WHERE e.emp_id = ?',
      [id],
      (err, results) => {
         err ? console.log('/read/empdetail/:id ' + err) : res.json(results[0])
      }
   )
})

// app.get('/read/empbydept/:dept', (req, res) => {
//    const dept = req.params.dept
//    const work = req.params.work
//    db.query("SELECT emp_id, nname FROM employee WHERE emp_id IN (SELECT emp_id FROM department WHERE dept_name IN(?) ORDER BY emp_id)", [dept],
//       (err, results) => {
//          err ? console.log('/read/empbydept ' + err) : res.json(results)
//       }
//    )
// })
//==============================================================================================//

// Create //
app.post('/create/emp', (req, res) => {
   const nname = req.body.nname
   const password = req.body.password
   const job_title = req.body.job_title
   const job_start = req.body.job_start
   const fname = req.body.fname
   const lname = req.body.lname
   const birthdate = req.body.birthdate
   const phone = req.body.phone
   const line_account = req.body.line_account

   db.query(
      "INSERT INTO employee(emp_id, line_account, password, fname, lname, nname, phone, job_title, job_start, birthdate) VALUES (NULL,?,?,?,?,?,?,?,?,?)",
      [line_account, password, fname, lname, nname, phone, job_title, job_start, birthdate],
      (err, results) => {
         err ? console.log('/create/emp ' + err) : res.send(results)
      })
});

app.post('/create/dept', (req, res) => {
   const dept_name = req.body.dept_name
   db.query('INSERT INTO department (emp_id, dept_name) VALUES ((SELECT MAX(emp_id) FROM employee), ?)', [dept_name],
      (err, results) => {
         err ? console.log('/create/dept ' + err) : res.send(results)
      })
});

app.post('/create/work_history', (req, res) => {
   db.query('INSERT INTO work_history (emp_id) VALUES ((SELECT MAX(emp_id) FROM employee))',
      (err, results) => {
         err ? console.log('/create/work_history ' + err) : res.send(results)
      })
});

app.post('/create/evaluate', (req, res) => {
   db.query('INSERT INTO evaluate (emp_id) VALUES ((SELECT MAX(emp_id) FROM employee))',
      (err, results) => {
         err ? console.log('/create/evaluate ' + err) : res.send(results)
      })
});

app.post('/create/work_schedule', (req, res) => {
   const date = req.body.date
   db.query("INSERT INTO work_schedule (sched_id, sched_date) VALUES (NULL, ?)", [date],
      (err, results) => {
         err ? console.log('/create/work_schedule ' + err) : res.send(results)
      })
});

app.post('/create/scheduling', (req, res) => {
   const emp_id = req.body.emp_id
   const dept = req.body.dept
   db.query("INSERT INTO scheduling (scheduling_id, sched_id, emp_id, dept_name) VALUES (NULL, (SELECT MAX(sched_id) FROM work_schedule), ?, ?)",
      [emp_id, dept],
      (err, results) => {
         err ? console.log('/create/scheduling ' + err) : res.send(results)
      })
});


////==============================================================================================////

// Update //
app.put('/update/emp/:id', (req, res) => {
   const id = req.params.id
   db.query(
      '',
      [id],
      (err, results) => {
         err ? console.log(err) : res.send(results)
      }
   );
})
////==============================================================================================////

// Delete //
app.delete('/delete/emp/:id', (req, res) => {
   const id = req.params.id
   db.query('DELETE FROM employee WHERE employee.emp_id = ?', [id],
      (err, results) => {
         err ? console.log('/delete/emp/:id ' + err) : res.send(results)
      }
   );
})


app.listen(81, function () {
   console.log('CORS-enabled web server listening on port 81')
});