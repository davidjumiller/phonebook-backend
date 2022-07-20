const mongoose = require('mongoose')

const generateId = () => {
    return Math.floor(Math.random()* 10000)
}

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@cluster0.afjhuzz.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: Number,
})
const Person = mongoose.model('Person', personSchema)


mongoose
    .connect(url)
    .then(result => {
        if (process.argv.length === 3) {
            Person.find({}).then(result => {
                console.log('phonebook:')
                result.forEach(person => {
                    console.log(person.name + " " + person.number)
                })
                mongoose.connection.close()
            })
        } else if (process.argv.length === 5) {
            const name = process.argv[3]
            const number = process.argv[4]

            const newPerson = new Person({
                id: generateId(),
                name: name,
                number: number,
            })

            newPerson.save().then(result => {
                console.log(`added ${name} number ${number} to phonebook`)
                mongoose.connection.close()
            })
        }
    })