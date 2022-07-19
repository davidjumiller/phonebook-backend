const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function getBody(req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random()* 10000)
}

app.get('/api/persons', (request, response) => { 
    response.json(persons)
})
app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`
        <div>Phonebook has info for ${persons.length} people</div>
        <br>
        <div>${date}</div>
    `)
})
app.get('/api/persons/:id', (request, response) => { 
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person) 
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    if ((!request.body.name) || (!request.body.number)) 
        return response.status(400).send({ error: 'Name and/or number is missing' })

    const duplicateNamedPerson = persons.find(person => person.name === request.body.name)
    if (duplicateNamedPerson) 
        return response.status(400).send({ error: 'Name must be unique' })

    const id = generateId()
    const newPerson = {
        id: id,
        name: request.body.name,
        number: request.body.number,
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
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
    console.log(`Server running on port ${PORT}`)
})