const mongoose = require('mongoose')
require('dotenv').config();

const url = process.env.DB_URL

const validateNumber = (phoneNum) => {
    return /^[0-9][0-9]([0-9]-|-[0-9])[0-9]+/.test(phoneNum) && phoneNum.length > 8
}

mongoose.connect(url)
    .then(result => console.log('connected to MongoDB'))
    .catch(err => console.log('error connecting to MongoDB: ', err.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 1,
        required: true,
        validate: validateNumber
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)