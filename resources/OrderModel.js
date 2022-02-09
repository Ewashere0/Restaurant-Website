const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderSchema = Schema({
	items: {
		type: Object, 
		required: true
	},
	total: {
		type: Number,
		required: true
	},
    restaurant: {
		type: String,
        required: true
	},
	subtotal: {
		type: Number,
		required: true
	},
    delivery: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    userID:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema, 'orders');
