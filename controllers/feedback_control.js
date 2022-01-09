const feedlist = require('../models/feedback')

module.exports.add = function (req, res) {
  console.log(req.body);
  const temp = new feedlist(req.body) 
   temp.save(req.body, function (err, feedlist) {
    if (err) { console.log(err); return }
    console.log(feedlist)
    return res.redirect('home')
  })
}

