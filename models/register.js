const mongoose = require('mongoose')

// defined schema of the db
const registerSchema = new mongoose.Schema({
 
  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirm_password: {
    type: String,
    required: true
  }
})

const registerlist = mongoose.model('registerlist', registerSchema)

module.exports = registerlist