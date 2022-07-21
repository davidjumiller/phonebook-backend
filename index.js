const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config();

const Person = require('./models/Person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function getBody(req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => { 
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => { 
    const id = request.params.id
    Person.findById(id, (err, person) => {
        if (err) {
            console.log(err)
            response.status(404).end()
        } else {
            response.json(person) 
        }
    })
})

app.get('/info', (request, response) => {
    const date = new Date()
    Person.find({}).then(persons => {
        response.send(`
        <div>Phonebook has info for ${persons.length} people</div>
        <br>
        <div>${date}</div>
    `)
    })
})

app.post('/api/persons', (request, response) => {
    if ((!request.body.name) || (!request.body.number)) 
        return response.status(400).send({ error: 'Name and/or number is missing' })

    const newPerson = new Person({
        name: request.body.name,
        number: request.body.number,
    })
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => { response.send('') })

app.patch('/api/persons/:id', (request, response) => { response.send('') })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})