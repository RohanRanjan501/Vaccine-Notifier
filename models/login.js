const mongoose = require('mongoose')

// defined schema of the db
const loginSchema = new mongoose.Schema({
 
  username: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  }
})

const loginlist = mongoose.model('loginlist', loginSchema)

module.exports = loginlist