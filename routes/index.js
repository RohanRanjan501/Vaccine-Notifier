const express = require('express')

const router = express.Router()

// required home controller module to handle the routes
const homeController = require('../controllers/home_controller')
const homeControl = require('../controllers/login_control')
const homeControls = require('../controllers/register_control')
const homeControlls = require('../controllers/feedback_control')

console.log('Router loaded')

// for homepage
router.get('/', homeController.home)

// for adding task
router.post('/add-task', homeController.add)

// for feedback
router.post('/feedback', homeControlls.add)

//for loginlist
router.post('/login', homeControl.add)

//for registeeerlist
router.post('/register', homeControls.add)

module.exports = router;