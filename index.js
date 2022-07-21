const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config();

const Person = require('./models/Person');
const { response } = require('express');

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function getBody(req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response, next) => { 
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(err => next(err))
})

app.get('/api/persons/:id', (request, response, next) => { 
    const id = request.params.id
    Person.findById(id)
        .then(person => {
            if (person) {
                response.json(person) 
            } else {
                console.log('failed to find id: ', request.params.id)
                response.status(404).end()
            }
        })
        .catch(err => next(err))
})

app.get('/info', (request, response, next) => {
    const date = new Date()
    Person.find({})
        .then(persons => {
            response.send(`
            <div>Phonebook has info for ${persons.length} people</div>
            <br>
            <div>${date}</div>`)
        })
        .catch(err => next(err))

})

app.post('/api/persons', (request, response, next) => {
    if ((!request.body.name) || (!request.body.number)) 
        return response.status(400).send({ error: 'Name and/or number is missing' })

    const newPerson = new Person({
        name: request.body.name,
        number: request.body.number,
    })
    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndRemove(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(err => next(err))
 })

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
    console.log(err.message)

    if (error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id' })
    }
    
    next(err)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})