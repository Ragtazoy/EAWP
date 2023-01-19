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
   db.query("SELECT e.emp_id, e.nname, e.password, e.fname, e.lname, e.job_title, e.job_start, e.phone, e.birthdate, e.line_account, w.job_hours, w.absent_quantity, w.late_quantity, w.leave_quantity, (SELECT GROUP_CONCAT(d.dept_name SEPARATOR ', ') FROM department d WHERE d.emp_id = e.emp_id) as dept FROM employee e JOIN work_history w ON e.emp_id = w.emp_id",
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

app.get('/read/work_schedule', (req, res) => {
   const sched_date = req.query.sched_date
   db.query("SELECT * FROM work_schedule WHERE sched_date = ?",
      [sched_date],
      (err, results) => {
         err ? console.log('/read/work_schedule ' + err) : res.json(results[0])
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
      "SELECT *, (SELECT GROUP_CONCAT(d.dept_name SEPARATOR ', ') FROM department d WHERE e.emp_id = d.emp_id) AS dept FROM employee e JOIN work_history w ON e.emp_id = w.emp_id WHERE e.emp_id = ?",
      [id],
      (err, results) => {
         err ? console.log('/read/empdetail/:id ' + err) : res.json(results[0])
      }
   );
})

app.get('/read/count_emp_by_job_title', (req, res) => {
   db.query("SELECT (SELECT COUNT(*) FROM employee WHERE job_title = 'full-time') AS 'full-time', (SELECT COUNT(*) FROM employee WHERE job_title = 'part-time') AS 'part-time' FROM dual",
      (err, results) => {
         err ? console.log('/read/count_emp_by_job_title ' + err) : res.json(results[0])
      }
   );
})

app.get('/read/count_emp_in_scheduling', (req, res) => {
   const sched_date = req.query.sched_date
   db.query("SELECT COUNT(*) AS count_emp FROM scheduling WHERE sched_id = (SELECT sched_id FROM work_schedule WHERE sched_date = ?)",
      [sched_date],
      (err, results) => {
         err ? console.log('/read/count_emp_in_scheduling ' + err) : res.json(results[0])
      }
   );
})

app.get('/read/emp_in_scheduling', (req, res) => {
   const sched_date = req.query.sched_date
   db.query("SELECT *, (SELECT e.nname FROM employee e WHERE e.emp_id = s.emp_id) AS nname FROM scheduling s WHERE s.sched_id = (SELECT w.sched_id FROM work_schedule w WHERE w.sched_date = ?)",
      [sched_date],
      (err, results) => {
         err ? console.log('/read/emp_in_scheduling ' + err) : res.json(results)
      }
   );
})

app.get('/read/a_emp_in_scheduling', (req, res) => {
   const emp_id = req.query.emp_id
   const sched_date = req.query.sched_date
   db.query("SELECT s.*, w.sched_date, (SELECT e.nname FROM employee e WHERE e.emp_id = s.emp_id) AS nname FROM scheduling s JOIN work_schedule w ON w.sched_id = s.sched_id WHERE s.emp_id = ? AND w.sched_date = ?",
      [emp_id, sched_date],
      (err, results) => {
         err ? console.log('/read/emp_in_scheduling ' + err) : res.json(results[0])
      }
   );
})
//======================================================================================================//

// Create //
app.post('/login', (req, res) => {
   const username = req.body.username
   const password = req.body.password
   db.query('SELECT * FROM employee WHERE nname = ? AND password = ?', [username, password],
      (err, results) => {
         if (err) {
            res.json({
               success: false,
               message: 'there are some error with query'
            })
         } else {
            if (results.length > 0) {
               res.json({
                  success: true,
                  message: 'successful login',
                  id: results[0].emp_id,
                  role: results[0].job_title
               })
            } else {
               res.json({
                  success: false,
                  message: 'Username or password is incorrect'
               })
            }
         }
      }
   );
})

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

app.post('/create/work_attendance', (req, res) => {
   const time_in = req.body.time_in
   const status = req.body.status
   const emp_id = req.body.emp_id
   const sched_id = req.body.sched_id
   db.query("INSERT INTO work_attendance (work_attend_id, time_in, time_out, status, emp_id, sched_id) VALUES (NULL, ?, NULL, ?, ?, ?)",
      [time_in, status, emp_id, sched_id],
      (err, results) => {
         err ? console.log('/create/work_attendance ' + err) : res.send(results)
      })
});



////==============================================================================================////

// Update //
app.post('/update/scheduling', (req, res) => {
   const sched_id = req.body.sched_id
   const emp_id = req.body.emp_id
   const dept = req.body.dept
   db.query("INSERT INTO scheduling (scheduling_id, sched_id, emp_id, dept_name) VALUES (NULL, ?, ?, ?)",
      [sched_id, emp_id, dept],
      (err, results) => {
         err ? console.log('/update/scheduling ' + err) : res.send(results)
      })
});

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

app.delete('/delete/work_schedule', (req, res) => {
   const sched_id = req.query.sched_id
   db.query("DELETE FROM work_schedule WHERE sched_id = ?",
      [sched_id],
      (err, results) => {
         err ? console.log('/delete/work_schedule ' + err) : res.send(results)
      }
   );
})

app.delete('/delete/emp_in_scheduling', (req, res) => {
   const sched_date = req.query.sched_date
   db.query("DELETE FROM scheduling WHERE sched_id = (SELECT sched_id FROM work_schedule WHERE sched_date = ?)",
      [sched_date],
      (err, results) => {
         err ? console.log('/delete/emp_in_scheduling ' + err) : res.send(results)
      }
   );
})


app.listen(81, function () {
   console.log('CORS-enabled web server listening on port 81')
});