const Vaccinelist = require('../models/task')

// controller for home page
module.exports.home = function (req, res) {
  // fetching data from database
 Vaccinelist.find({}, function (err, task) {
    if (err) {
      console.log('Error in fetching list from db')
      return
    }
    return res.render('login', {
      title: 'Vaccine Notifier'
    })
  })
}

module.exports.add = function (req, res) {
  console.log(req.body);
  const temp = new Vaccinelist(req.body) 
   temp.save(req.body, function (err, Vaccinelist) {
    if (err) { console.log(err); return }
    console.log(Vaccinelist)
    return res.redirect('home')
  })
}

