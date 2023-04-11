const express = require('express')
const cors = require('cors')
const pool = require('./db')
const PORT = 5000
const app = express()

//middleware
app.use(cors())  
app.use(express.json()) //allow reading of req.body from client side

// ROUTES

//create 

app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", [description])
        res.json(newTodo.rows[0])
        console.log(req.body)
    } catch (error) {
        console.log(error)
    }
})

//get all

app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * from todo")
        res.json(allTodos.rows)
    } catch (error) {
        console.log(error)
    }
})

//get a todo

app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const todo = await pool.query("SELECT * from todo WHERE id = $1", [id])
        res.json(todo.rows)
    } catch (error) {
        console.log(error)
    }
})

//update a todo

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body
        const todo = await pool.query("UPDATE todo SET description = $1 WHERE id = $2", [description, id])
        res.json(todo)
    } catch (error) {
        console.log(error)   
    }
})

//delete a todo

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params
        await pool.query("DELETE from todo WHERE id = $1", [id])
        res.json({message: "todo deleted successfully", status: "success"})
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})