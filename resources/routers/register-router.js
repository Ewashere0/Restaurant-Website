const express = require('express');
let router = express.Router();

router.get('/', getRegistration);

//sends registration page
function getRegistration(req, res, next){
	if(req.session.loggedin){
		res.status(403).send('You are already logged in');
		return;
	}
    res.format({
		"text/html": () => {res.render("../views/pages/register")}
	});
}

//Export the router so it can be mounted in the main app
module.exports = router;