const mongoose = require('mongoose')

// defined schema of the db
const feedSchema = new mongoose.Schema({
 
  message: {
    type: String,
    required: true
  }

})

const feedbackList = mongoose.model('feedbackList', feedSchema)

module.exports = feedbackList