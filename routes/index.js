var express = require('express');
var router = express.Router();

let landing = require('../controllers/landing');
let user = require('../controllers/user');

//* Middleware 👇
let { isLoggedIn } = require('../middleware/hasAuth');


//* User Auth sect. 👇
router.get('/login', user.show_login);
router.get('/signup', user.show_signup);
router.post('/login', user.login);
router.post('/signup', user.signup);
router.post('/logout', user.logout);
router.get('/logout', user.logout);

//* Lead sect. 👇

router.get('/', landing.get_landing);
router.post('/', landing.submit_lead);
router.get('/leads', isLoggedIn,  landing.show_leads);
router.get('/lead/:lead_id', landing.show_lead);
router.get('/lead/:lead_id/edit', landing.show_edit_lead);
router.post('/lead/:lead_id/edit', landing.edit_lead);
router.post('/lead/:lead_id/delete', landing.delete_lead);
router.post('/lead/:lead_id/delete-json', landing.delete_lead_json);


module.exports = router;

// const noop = function(req, res, next) { 
//?   // when the '/leads' route gets called the first parameter gets executed
//?   // is 'noop'. when 'next()' gets called, the second parameter will be
//?   // executed, which in the case of '/leads' is landing.show_leads
//   next(); 
// };