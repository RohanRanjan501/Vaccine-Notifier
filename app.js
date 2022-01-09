
const express = require('express');
const path = require('path');
const request = require('request');
const fs = require('fs')
// const fetch = require('node-fetch')
const fetch = import('node-fetch')
const https = require('https');
// globalThis.fetch = fetch
// const fetch = require('./node_modules/node-fetch/@types/index')
// import axios, * as others from 'axios';
const nodemailer = require('nodemailer');
require('dotenv').config()
const port = 80;
const hostname = '127.80.0.1'
let router = express.Router();
const app = express();
const db = require('./config/mongoose')

const Vaccinelist = require('./models/task')

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
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

let mailOptions = {
    from: `"Vaccine Slots" <${process.env.EMAIL}>`, // sender address
    bcc: `rohit.singh19@vit.edu`, // list of receivers
    subject: 'Vaccination Slots Available', // Subject line
    html: '<h2>Slots available</h2> <hr>',
    
};

app.get("/data", (req, response)=>{   
    pincode = req.query.pincode
    date = req.query.date
    url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`
    https.get(url, res => {
    let data = [];
    res.on('data', chunk => {
        data.push(chunk);
    });
    res.on('end', () => {
        const users = JSON.parse(Buffer.concat(data).toString());
        // console.log(users.sessions)
        response.send(users.sessions)
    });
    }).on('error', err => {
    console.log('Error: ', err.message);
    });      
})

function generateEmail(data){
    mailOptions.html = ''
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
}
app.get("/sendMail", (req, res)=>{

    Vaccinelist.find({}, {_id:0,zip:1}, (error, dat)=>{
        // console.log(dat);
        const unique = [...new Set(dat.map(item => item.zip))];
        
        unique.forEach(pincode=>{

            let dateObj = new Date();
            let month = dateObj.getUTCMonth() + 1; 
            let day = dateObj.getUTCDate();
            let year = dateObj.getUTCFullYear();

            newdate = day + '-' + month + '-' + year;
            console.log(newdate)
            url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${newdate}`
            https.get(url, res => {
            let data = [];
            res.on('data', chunk => {
                data.push(chunk);
            });
            res.on('end', () => {
                const slots = JSON.parse(Buffer.concat(data).toString());
                // console.log(slots.sessions)

                Vaccinelist.find({zip:pincode}, {_id:0, email:1}, (error, emails)=>{
                    console.log(emails)
                    mailOptions.bcc = ''
                    emails.forEach((currEmail, index)=>{
                        mailOptions.bcc += `${currEmail.email}`
                        if(index<emails.length-1){
                            mailOptions.bcc += ','
                        }
                    })
                    generateEmail(slots.sessions)
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            return console.log(error);
                        }
                        console.log('Message sent: ' + info.response);
                    });
                })

                    
                })

            }).on('error', err => {
            console.log('Error: ', err.message);
            });
        })
    })
    res.send("done")
})


app.listen(port, ()=>{
    console.log("server running on http://127.80.0.1/");
})




