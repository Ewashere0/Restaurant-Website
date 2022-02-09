const pug = require("pug");
const mongoose = require("mongoose");

const express = require('express');
const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session)

let store = new MongoDBStore({
	uri: 'mongodb://localhost:27017/a4',
	collection: 'sessions'
})

const fs = require('fs');
const path = require('path');

const app = express();

app.use(session({secret: 'key', store: store}))

let restaurants = {}; //restaurant data from json
let orders = {}; //order data from order page (user input)
let nextid = 0; //id for new restaurants

app.set("view engine", "pug");

let loginRouter = require("./routers/login-router");
app.use("/login", loginRouter);

let registerRouter = require('./routers/register-router');
app.use("/registration", registerRouter);

let userRouter = require("./routers/user-router");
app.use("/users", userRouter);

app.route('/logout').get(express.json(), [logout, getHome]);

function logout(req, res, next){
	req.session.loggedin = false;
	req.session.user = null;
	req.session.username = null;
	req.session.admin = false;
	next();
}

//////////////////////////////////////////////////////////////////
//everyinging below this was created for previous assignments
//and is reused for this assignment
//////////////////////////////////////////////////////////////////

//routes
app.route('/')
	.get(express.json(), getHome);

app.route('/stats')
	.get(express.json(), getStats);

app.route('/orders')
	.get(express.json(), getData)
	.put(express.json(), putData);

app.route('/orders/:orderID')
	.get(express.json(), getOrderInfo);

app.route('/addrestaurant')
	.get(express.json(), addRestaurant);

app.route('/restaurants')
	.get(express.json(), browseRestaurants)
	.post(express.json(), createRestaurant);

app.route('/restaurants/:restID')
	.get(express.json(), editRestaurant)
	.put(express.json(), updateRestaurant);

app.route('/order')
	.get(express.json(), orderRestaurants)

app.route('/order/:restID')
	.get(express.json(), getOrder);

app.route('/background.jpg')
	.get(express.json(), getBackground);

app.route('/background-loop.jpg')
	.get(express.json(), getBackgroundLoop);

app.route('/add.png')
	.get(express.json(), getAdd);

app.route('/remove.png')
	.get(express.json(), getRemove);

//returns home page
function getHome(req, res, next){
	let data = pug.renderFile("views/pages/home.pug", {
		loggedin: req.session.loggedin, 
		admin: req.session.admin, 
		id: req.session.user
	});
	res.setHeader('Content-Type', 'text/html');
	res.status(200).send(data);
	return;
}

//returns stats page
function getStats(req, res, next){
	if(!req.session.admin){
		res.status(403).send('admin priveleges required');
		return;
	}
	let data = pug.renderFile("views/pages/stats.pug", {
		loggedin: req.session.loggedin, 
		admin: req.session.admin, 
		id: req.session.user
	});
	res.setHeader('Content-Type', 'text/html');
	res.status(200).send(data);
}

//returns sales data for stats page
function getData(req, res, next){
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send(JSON.stringify(orders));
}

//adds sales data from order page
function putData(req, res, next){
	//local storage for stats page from a3
	let newOrders = req.body;
	Object.keys(newOrders).forEach(restaurant => {
		if(restaurant != 'customerInfo'){
			orders[restaurant]["numOrders"] += 1;

			//add orders to each restaurant
			Object.keys(newOrders[restaurant]).forEach(key => {
				if(orders[restaurant][key]){
					orders[restaurant][key] += newOrders[restaurant][key];
				}
				else{
					orders[restaurant][key] = newOrders[restaurant][key];
				}
			});
		}
	});

	//add order to database
	mongoose.connect("mongodb://localhost:27017/a4", {useNewUrlParser:true});
    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        const Order = require('./OrderModel');
		newOrders.customerInfo.userID = req.session.user;
		newOrders.customerInfo.username = req.session.username;
		let newOrder = new Order(newOrders.customerInfo);
        newOrder.save(function(err, result){
            if(err){
                mongoose.connection.close();
                res.status(500).send('server error');
                return;
            }
            mongoose.connection.close();
            res.status(201).send(JSON.stringify({user: req.session.user, order: result._id}));
        });
    });
}

//renders page for an order
function getOrderInfo(req, res, next){
	let id = req.params.orderID;

	mongoose.connect("mongodb://localhost:27017/a4", {useNewUrlParser:true});
    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        const Order = require('./OrderModel');

        Order.findOne({_id: id}, function(err, order){
            if(err){
                mongoose.connection.close();
                res.status(500).send('server error');
                return;
            }
            if(order.userID == req.session.user){
				mongoose.connection.close();
				let data = pug.renderFile('views/pages/orderSummary.pug', {
					loggedin: req.session.loggedin, 
					admin: req.session.admin, 
					id: req.session.user,
					username: order.username,
					items: order.items,
					total: order.total,
					restaurant: order.restaurant,
					subtotal: order.subtotal,
					delivery: order.delivery,
					tax: order.tax,
					userID: order.userID
				});
				res.status(200).send(data);
			}
			else{
				const User = require('./UserModel');
				User.findOne({_id: order.userID}, function(err, user){
					if(err){
						mongoose.connection.close();
						res.status(500).send('server error');
						return;
					}
					mongoose.connection.close();
					if(user.privacy){
						res.status(403).send('You are not authorized to view this data');
						return;
					}
					else{
						let data = pug.renderFile('views/pages/orderSummary.pug', {
							loggedin: req.session.loggedin, 
							admin: req.session.admin, 
							id: req.session.user,
							username: order.username,
							items: order.items,
							total: order.total,
							restaurant: order.restaurant,
							subtotal: order.subtotal,
							delivery: order.delivery,
							tax: order.tax,
							userID: order.userID
						});
						res.status(200).send(data);
					}
				});
			}
		});
    });
}

//returns add restaurant page
function addRestaurant(req, res, next){
	if(!req.session.admin){
		res.status(403).send('admin priveleges required');
		return;
	}
	let data = pug.renderFile("views/pages/addrestaurant.pug", {
		loggedin: req.session.loggedin, 
		admin: req.session.admin, 
		id: req.session.user,
		nextid: nextid
	});
	res.setHeader('Content-Type', 'text/html');
	res.status(200).send(data);	
}

//list of restaurants to edit
function browseRestaurants(req, res, next){
	if(!req.session.admin){
		res.status(403).send('admin priveleges required');
		return;
	}
	res.format({
		html: function(){
			res.setHeader('Content-Type', 'text/html');
			let data = pug.renderFile("views/pages/browseRestaurants.pug", {
				loggedin: req.session.loggedin, 
				admin: req.session.admin, 
				id: req.session.user,
				restaurants: restaurants
			});
			res.status(200).send(data);
		},
		json: function(){
			res.setHeader('Content-Type', 'applicaion/json');
			res.status(200).send(JSON.stringify({"restaurants": Object.keys(restaurants)}));
		},
		default: function(){
			send404(res);
		}
	})
}

//adds restaurant to restaurants object
function createRestaurant(req, res, next){
	if(!req.session.admin){
		res.status(403).send('admin priveleges required');
		return;
	}
	let newresto = req.body;
	if(!('name' in newresto && 'delivery_fee' in newresto && 'min_order' in newresto)){
		send404(res);
		return;
	}
	newresto.id = nextid;
	newresto.menu = {};
	restaurants[nextid] = newresto;
	orders[nextid] = {"numOrders": 0, 'name': restaurants[nextid].name};
	++nextid;
	res.status(201).send(newresto);
}

//returns menu editing page
function editRestaurant(req, res, next){
	if(!req.session.admin){
		res.status(403).send('admin priveleges required');
		return;
	}
	let restID = req.params.restID;
	restID = parseInt(restID);

	if(!(restID in restaurants)){
		send404(res);
		return;
	}
	res.format({
		html: function(){
			let data = pug.renderFile("views/pages/editRestaurant.pug", {
				loggedin: req.session.loggedin, 
				admin: req.session.admin, 
				id: req.session.user,
				resto: restaurants[restID]
			});
			res.setHeader('Content-Type', 'text/html');
			res.status(200).send(data);
		},
		json: function(){
			res.setHeader('Content-Type', 'application/json');
			res.status(200).send(JSON.stringify(restaurants[restID]));
		}
	})
}

//updates exisiting restaurant menu
function updateRestaurant(req, res, next){
	if(!req.session.admin){
		res.status(403).send('admin priveleges required');
		return;
	}
	let restID = req.params.restID;
	restID = parseInt(restID);

	if(!(restID in restaurants)){
		send404(res);
		return;
	}
	restaurants[restID] = req.body;
	orders[restID].name = restaurants[restID].name;
	res.status(201).send();
}

//list of restaurants to order from
function orderRestaurants(req, res, next){
	if(!req.session.loggedin){
		res.status(403).send('Please login to access this page');
		return;
	}
	res.setHeader('Content-Type', 'text/html');
	let data = pug.renderFile("views/pages/orderRestaurants.pug", {
		restaurants: restaurants,
		loggedin: req.session.loggedin, 
		admin: req.session.admin, 
		id: req.session.user
	})
	res.status(200).send(data);
}

//returns order page
function getOrder(req, res, next){
	if(!req.session.loggedin){
		res.status(403).send('Please login to access this page');
		return;
	}
	let restID = parseInt(req.params.restID);
	if(!(restID in restaurants)){
		send404(res);
		return;
	}
	res.setHeader('Content-Type', 'text/html');
	let data = pug.renderFile("views/pages/order.pug", {
		resto: restaurants[restID],
		loggedin: req.session.loggedin, 
		admin: req.session.admin, 
		id: req.session.user
	});
	res.status(200).send(data);
}

//restaurant looking background
function getBackground(req, res, next){
	fs.readFile("./images/background.jpg", function(err, data){
		if(err){
			send500(res);
			return;
		}
		res.setHeader("Content-Type", "img/png");
		res.status(200).send(data);
	});
}

//wood looking background
function getBackgroundLoop(req, res, next){
	fs.readFile("./images/background-loop.jpg", function(err, data){
		if(err){
			send500(res);
			return;
		}
		res.setHeader("Content-Type", "img/png");
		res.status(200).send(data);
	});
}

//add button
function getAdd(req, res, next){
	fs.readFile("./images/add.png", function(err, data){
		if(err){
			send500(response);
			return;
		}

		res.setHeader("Content-Type", "img/png");
		res.status(200).send(data);
	});
	return;
}

//remove button
function getRemove(req, res, next){
	fs.readFile("./images/remove.png", function(err, data){
		if(err){
			send500(response);
			return;
		}

		res.setHeader("Content-Type", "img/png");
		res.status(200).send(data);
	});
	return;
}

//Helper function to send a 404 error
function send404(response){
	response.statusCode = 404;
	response.write("Unknown resource.");
	response.end();
}

//Helper function to send a 500 error
function send500(response){
	response.statusCode = 500;
	response.write("Server error.");
	response.end();
}

try{
	//get json data from files
	const jsonsInDir = fs.readdirSync('./restaurants').filter(file => path.extname(file) === '.json');

	jsonsInDir.forEach(file => {
		const fileData = fs.readFileSync(path.join('./restaurants', file));
		const json = JSON.parse(fileData.toString());
		restaurants[json.id] = json;
		++nextid;
	});

	//save restaurants names for stats page
	Object.keys(restaurants).forEach(key =>{
		orders[key] = {"numOrders": 0, 'name': restaurants[key].name};
	});

	//Start server
	app.listen(3000);
	console.log("Server listening at http://localhost:3000");

}catch(err){
	console.log("Error loading files.", err);
}