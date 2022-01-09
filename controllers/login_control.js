const registerlist = require('../models/register')

module.exports.add = function (req, res) {
  console.log(req.body);
  registerlist.find({email:req.body.email, password:req.body.password}, (error,users)=>{
    if(users!=undefined && users.length>0){
      return res.redirect('home')
    }
    else res.send("Invalid ID or password")
  })
}

