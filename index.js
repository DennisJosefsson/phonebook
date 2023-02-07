const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', (req) => JSON.stringify(req.body))
const logger = morgan(':method :url :status :response-time :body')
app.use(express.json())
app.use(logger)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const generateId = () => {
  const id = Math.floor(Math.random() * 100000)
  return id
}

app.get('/info', (request, response) => {
  const time = new Date()
  const string = `<p>Phonebook has info for ${persons.length} people</p> 
  <p>${time}</p>`
  response.send(string)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((p) => p.id === id)
  if (person) {
    response.json(person)
  }
  response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((p) => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number is missing',
    })
  }

  if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: `The name ${body.name} already exists in the phonebook`,
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
