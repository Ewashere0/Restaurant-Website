# Lord of the Restaurants

![Alt Text](https://github.com/Ewashere0/Restaurant-Website/blob/main/screenshots/Screenshot%202022-02-09%20093408.png?raw=true)

[Website link](https://serene-plateau-76113.herokuapp.com/stats)

Notes:
	Website that allows users to create accounts to buy from a selection of restaurants
	using admin login 'user: ethan, password: ethan', restaurants can be created and edited.
	User page contains user order data, and admin stats page contains restaurant order data.

Instructions:

	From this directory:
		terminal1:
			npm install
			mkdir mydb
			mongod -dbpath=mydb
		terminal2:
			node .\database-initializer.js
			cd .\resources
			node .\server.js

	From your favourite browser:
	http://localhost:3000/


File structure:

	server{
		images{
			add.png
			background.jpg //background for other pages
			background-loop.jpg //background for order page
			favicon.ico //never got this to work
			remove.png
		}
		restaurants{
			aragorn.json
			frodo.json
			legolas.json
		}
		routers{
			login-router.js //handles login related requests
			register-router.js //handles registration related requests
			user-router.js //handles user related requests
		}
		scripts{
			addRestaurant.js // client javascript for adding new restaurant
			editRestaurant.js // client javascript for editing resaurant info
			login.js //client javascript for login page
			order.js //client javascript for order page
			register.js //client jsvascript for register page
			setPrivacy.js //client javascript for privacy button on profile
			stats.js //client javascript for stats page
		}
		styles{
			styles.css //styles for everything
		}
		views{
			pages{
				addRestaurant.pug //pug for addrestaurant page
				browseRestaurants.pug // pug for restaurants page
				editRestaurant.pug // pug for restaurant/:restID page
				home.pug //pug for home page
				layout.pug //chooses correct header
				login.pug //pug for login page
				order.pug //pug for restaurant select for order page
				orderRestaurants.pug //pug for order page
				orderSummary.pug //pug for single order page from profile link
				profile.pug //pug for user profile
				register.pug //pug for registration page
				stats.pug //pug for stats page
				users.pug //pug for users page
			}
			partials{
				adminHeader.pug //pug for admin header
				loginHeader.pug //pug header for user whos logged in
				loginHeader.pug //pug header for user whos not logged in
				privacy.pug //pug footer for privacy toggle on profile page
			}
		}
		OrderModel.js //schema for mongoose order
		UserModel.js //schema for mongoose user
		server.js //server javascript interacts with everything
	}
	database-initializer.js //for loading some users into the db
	package.json //for installing node modules and other information
	README.txt //have I been here before?
			
