
const express = require('express');
const path = require('path');
const request = require('request');
const fs = require('fs')
const fetch = import('node-fetch');
const nodemailer = require('nodemailer');
const res = require('express/lib/response');
require('dotenv').config()
const port = 80;
const hostname = '127.80.0.1'
var router = express.Router();
const app = express();
const db = require('./config/mongoose')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded())
app.use(express.static('assets'))

// used express routes
app.use('/', require('./routes/index'))
app.get("/home", function (req, res) {
    res.render("home");
});


//app.use('/static', express.static('static'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('assets'))


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// used express routes
app.use('/', require('./routes/index'))
app.get("/home", function (req, res) {
    res.render("home");
});
app.get("/feedback", function (req, res) {
    res.render("feedback");
});
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

let mailOptions = {
    from: `"Rohit Mail" <${process.env.EMAIL}>`, // sender address
    bcc: `rohit.singh19@vit.edu`, // list of receivers
    subject: 'Vaccination Slots Available', // Subject line
    html: '<h2>Slots available</h2> <hr>',
    
};


async function getVaccineDetails(){
    url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=410206&date=03-01-2022'
    const response = await fetch(url)
    const data = await response.json()
    return data.sessions;
}

app.get("/", (req, res)=>{   
    getVaccineDetails().then(data=>{
        res.send(data)
    }).catch(error=>{
        res.send(error)
    })      
})

app.get("/sendMail", (req, res)=>{
    getVaccineDetails().then(data=>{
        Array.from(data).forEach(slot => {    
            if(slot.available_capacity>0){      
                mailOptions.html += `<div>
                <h3> <strong>${slot.name}</strong> </h3>
                <div>
                    <div>
                        <strong>${slot.address}, ${     slot.block_name}, ${    slot.district_name}, ${    slot.state_name}, ${   slot.pincode}</strong>
                        <div>
                            <div class="row">
                                <div class="col">
                                    <strong>Vaccine :</strong> ${slot.vaccine}
                                </div>
                                <div class="col">
                                <strong>Fees :</strong> ${slot.fee}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <strong>Dose 1 capacity :</strong> ${slot.available_capacity_dose1}
                                </div>
                                <div class="col">
                                    <strong>Dose 2 capacity :</strong> ${slot.available_capacity_dose2}
                                </div>
                            </div>
                            <div class="col">
                                <div class="col">
                                    <strong>Slots :</strong>
                                </div>
                                <div class="col">
                                    09:00AM-11:00AM
                                </div>
                                <div class="col">
                                    11:00AM-01:00PM
                                </div>
                                <div class="col">
                                    01:00PM-03:00PM
                                </div>
                                <div class="col">
                                    03:00PM-06:00PM
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div><hr>`
            }
        });

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    })
    res.send("done")
})


app.listen(port, ()=>{
    console.log("server running on http://127.80.0.1/");
})




