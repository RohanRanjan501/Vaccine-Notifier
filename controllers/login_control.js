const loginlist = require('../models/login')

module.exports.add = function (req, res) {
  console.log(req.body);
  const temp = new loginlist(req.body) 
   temp.save(req.body, function (err, loginlist) {
    if (err) { console.log(err); return }
    console.log(loginlist)
    return res.redirect('home')
  })
}

