// require the library
const mongoose = require('mongoose')

// acquire the connection(to check if it's successful)

const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
// acquired connection to db
const db = mongoose.connection

// error
db.on('error', console.error.bind(console, 'Error connecting to MongoDB'))

// up and running then print the message
db.once('open', function () {
  console.log('Connected to Database :: MongoDB')
})

module.exports = db