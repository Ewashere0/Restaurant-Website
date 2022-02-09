const express = require('express');
let router = express.Router();

router.get("/", getLogin);
router.put("/:uid", express.json(), loginUser);

//returns login page
function getLogin(req, res, next){
	if(req.session.loggedin){
		res.status(403).send('You are already logged in');
		return;
	}
	res.format({
		"text/html": () => {res.render("../views/pages/login")}
	});	
}

//sets session data for when user logs in
function loginUser(req, res, next){
	req.session.user = req.params.uid;
	req.session.loggedin = true;
	req.session.username = req.body.username;
	req.session.admin = req.body.admin;
	res.status(201).send();
}

//Export the router so it can be mounted in the main app
module.exports = router;