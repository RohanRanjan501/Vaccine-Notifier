const registerlist = require('../models/register')

module.exports.add = function (req, res) {
  console.log(req.body);
  const temp = new registerlist(req.body) 
   temp.save(req.body, function (err, registerlist) {
    if (err) { console.log(err); return }
    console.log(registerlist)
    return res.redirect('home')
  })
}

