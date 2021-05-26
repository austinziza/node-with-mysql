const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = new express()
const port = process.env.PORT || 5000


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//mysql
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student'
})

//get all students details

app.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)
        connection.query('SELECT * FROM profile', (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

//get a student by their id
app.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)
        connection.query('SELECT * FROM profile WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})



//delete a student from the profile record
app.delete('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)
        connection.query('DELETE FROM profile WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()
            if (!err) {
                res.send(`student with the id ${req.params.id} has been removed from the record`)
            } else {
                console.log(err)
            }
        })
    })
})



// add a new student record
app.post('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)
        const params = req.body
        connection.query('INSERT INTO profile  set ?', params, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(`student with the name ${params.name} has been added to the record`)
            } else {
                console.log(err)
            }
        })
    })
})



// update a student record
app.put('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)
        const {id, name, email, department, age} = req.body
        connection.query('UPDATE profile  set name = ?, email = ?, department = ?, age = ? WHERE id = ?', [name,email,department, age, id], (err, rows) => {
            connection.release()
            if (!err) {
                res.send(`student with the name ${name} has been updated`)
            } else {
                console.log(err)
            }
        })
    })
})


app.listen(port, () => console.log(`listening on port ${port}`))