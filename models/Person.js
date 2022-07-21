const mongoose = require('mongoose')
require('dotenv').config();

const url = process.env.DB_URL

mongoose.connect(url)
    .then(result => console.log('connected to MongoDB'))
    .catch(err => console.log('error connecting to MongoDB: ', err.message))

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)