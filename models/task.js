const mongoose = require('mongoose')

// defined schema of the db
const listSchema = new mongoose.Schema({
 
  phone_no: {
    type: String,
    required: true
  },

  FreeOrNot: {
    type: String,
    required: true
  },

  age: {
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true
  },
 
  zip: {
    type: String,
    required: true
  },
  
  dose: {
    type: String,
    required: true
  },

  vaccine_type: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  }
})

const Vaccinelist = mongoose.model('Vaccinelist', listSchema)

module.exports = Vaccinelist