//order object
class Order {
	constructor(deliveryFee, minOrder) {
		this.subtotal = (0).toFixed(2);
		this.tax = (0).toFixed(2);
		this.deliveryFee = deliveryFee.toFixed(2);
		this.total = deliveryFee.toFixed(2);
		this.minOrder = minOrder.toFixed(2);
		this.itemDivs = [];
	}

	//add new item to list
	addItem(itemInfo){
		this.itemDivs.push(itemInfo);
	}

	//remove item from list
	removeItem(index){
		this.itemDivs.splice(index, 1);
	}

	//change overall pricing
	updatePrice(price){
		this.subtotal = (parseFloat(this.subtotal) + price).toFixed(2);
		this.tax = (parseFloat(this.subtotal) * 0.1).toFixed(2);
		this.total = (parseFloat(this.subtotal) + parseFloat(this.tax) + parseFloat(this.deliveryFee)).toFixed(2);
	}

}

let curOrder = new Order(restaurant.delivery_fee, restaurant.min_order);
loadPage();

/////////////////////////////////////////////////////////////
//everything below this is pretty much copy-paste
//from my assignment 1 except for the checkout function
//and part of the changeresto function
/////////////////////////////////////////////////////////////

//refresh page
function loadPage(){
	//wait for the request above to get back before continuing

	document.getElementsByTagName('title')[0].innerHTML = restaurant.name;
		
	//create new divs
	createRestoInfo();
	createMenuInfo();
	createOrderInfo();
}

//create div with info about the restaurant
function createRestoInfo(){
	let div = document.getElementById('info');
	div.innerHTML = '';

	//create name tag
	let nameEle = document.createElement('h1');
	nameEle.id = restaurant.name;
	nameEle.innerHTML = restaurant.name;
	nameEle.classList.add('RestoInfo');

	//create min order amount tag
	let minOrderEle = document.createElement('h3');
	minOrderEle.id = restaurant.min_order;
	minOrderEle.innerHTML = 'Minimum Order Amount: ' + restaurant.min_order.toFixed(2);
	minOrderEle.classList.add('RestoInfo');

	//create delivery charge tag
	let deliveryEle = document.createElement('h3');
	deliveryEle.id = restaurant.delivery_fee;
	deliveryEle.innerHTML = 'Delivery Charge: ' + restaurant.delivery_fee.toFixed(2);
	deliveryEle.classList.add('RestoInfo');

	//append info to a new div
	let infoDiv = document.createElement('div');
	infoDiv.classList.add('info')

	infoDiv.appendChild(nameEle);
	infoDiv.appendChild(minOrderEle);
	infoDiv.appendChild(deliveryEle);

	div.appendChild(infoDiv);
}

//create div with menu info
function createMenuInfo(){
	let div = document.getElementById('newElements');

	//div for entire menu
	let menuDiv = document.createElement('div');
	menuDiv.id = 'menu';
	menuDiv.classList.add('MainDivs');

	//div for navigation links
	let linkDiv = document.createElement('ul');
	linkDiv.id = 'link';
	linkDiv.classList.add('MainDivs');

	let menu = restaurant.menu;

	//loop through categries in menu
	Object.keys(menu).forEach(categoryKey => {
		
		//div for current category
		let categoryDiv = document.createElement('div');

		//add category to page
		let title = document.createElement('h3');
		title.innerHTML = categoryKey;
		categoryDiv.appendChild(title);

		let items = menu[categoryKey];

		//loop through items in category
		Object.keys(items).forEach((itemKey) => {

			let itemInfo = items[itemKey];
			
			//div for current item
			let itemDiv = document.createElement('div');

			//name
			let name = document.createElement('p');
			name.innerHTML = itemInfo.name + ' ($' + itemInfo.price.toFixed(2) + ')';
			name.value = itemInfo.price;
			name.classList.add('Item');
			name.classList.add('ItemName');
			name.style.fontWeight = 'bold'
			
			//description
			let description = document.createElement('p');
			description.innerHTML = itemInfo.description;
			description.classList.add('Item');
			
			//add button
			let add = document.createElement('img');
			add.addEventListener('click', function(){addToOrder(itemInfo)});
			add.src = '/add.png';
			add.classList.add('AddButton');

			//append info to item
			itemDiv.appendChild(name);
			itemDiv.appendChild(add);
			itemDiv.appendChild(description);
			itemDiv.classList.add('ItemDiv');
			
			//append item to category
			categoryDiv.appendChild(itemDiv);
		});

		categoryDiv.id = categoryKey;

		//create new link
		let newLink = document.createElement('a');
		newLink.href = '#' + categoryKey;
		newLink.innerHTML = categoryKey;

		let listElement = document.createElement('li');
		listElement.appendChild(newLink);

		//append new link to linkdiv
		linkDiv.appendChild(listElement);
		linkDiv.appendChild(document.createElement('br'));

		//append category to menu
		menuDiv.appendChild(categoryDiv);
		menuDiv.appendChild(document.createElement('br'));
		menuDiv.appendChild(document.createElement('br'));
	});

	div.appendChild(document.createElement('br'));
	div.appendChild(linkDiv);
	div.appendChild(menuDiv);
}

//create div with info about the current order
function createOrderInfo(){

	let div = document.getElementById('newElements');
	let orderInfo;

	if(document.getElementById('order')){
		//on subsequent loads
		document.getElementById('order').innerHTML = "";
		orderInfo = document.getElementById('order');
	}
	else{
		//on first load
		orderInfo = document.createElement('div');
	}

	//create new div
	orderInfo.id = 'order';
	orderInfo.classList.add('MainDivs');
	
	//create info to put in div
	let subtotal = document.createElement('p');
	subtotal.innerHTML = 'Subtotal';
	subtotal.classList.add('OrderItem');

	let subtotalPrice = document.createElement('p');
	subtotalPrice.innerHTML = curOrder.subtotal;
	subtotalPrice.classList.add('PriceItem');

	let tax = document.createElement('p');
	tax.innerHTML = 'Tax';
	tax.classList.add('OrderItem');

	let taxPrice = document.createElement('p');
	taxPrice.innerHTML = curOrder.tax;
	taxPrice.classList.add('PriceItem');

	let deliveryFee = document.createElement('p');
	deliveryFee.innerHTML = 'Delivery Fee';
	deliveryFee.classList.add('OrderItem');

	let deliveryPrice = document.createElement('p');
	deliveryPrice.innerHTML = curOrder.deliveryFee;
	deliveryPrice.classList.add('PriceItem');

	let total = document.createElement('p');
	total.innerHTML = 'Total';
	total.classList.add('OrderItem');

	let totalPrice = document.createElement('p');
	totalPrice.innerHTML = curOrder.total;
	totalPrice.classList.add('PriceItem');

	let remaining = curOrder.minOrder - curOrder.subtotal;
	let remainingRequired;
	if(remaining > 0){
		//show how much more to add to the order
		remainingRequired = document.createElement('p');
		remainingRequired.innerHTML = 'Add $' + remaining.toFixed(2) + ' more to your order.';
		remainingRequired.classList.add('OrderItem');
	}
	else{
		//create submit button
		remainingRequired = document.createElement('button');
		remainingRequired.innerHTML = 'Checkout';
		remainingRequired.addEventListener('click', checkout);
		remainingRequired.style.marginTop = '10px';
	}

	//add previously ordered and newly ordered items
	Object.keys(curOrder.itemDivs).forEach(divKey => {
		let orderDiv = document.createElement('div');
		orderDiv.classList.add('ItemDiv');

		orderDiv.appendChild(curOrder.itemDivs[divKey].info);
		orderDiv.appendChild(curOrder.itemDivs[divKey].remove);
		orderInfo.appendChild(orderDiv);
	});

	//put info in div
	orderInfo.appendChild(subtotal);
	orderInfo.appendChild(subtotalPrice);
	orderInfo.appendChild(document.createElement('br'));
	orderInfo.appendChild(tax);
	orderInfo.appendChild(taxPrice);
	orderInfo.appendChild(document.createElement('br'));
	orderInfo.appendChild(deliveryFee);
	orderInfo.appendChild(deliveryPrice);
	orderInfo.appendChild(document.createElement('br'));
	orderInfo.appendChild(total);
	orderInfo.appendChild(totalPrice);
	orderInfo.appendChild(document.createElement('br'));
	orderInfo.appendChild(remainingRequired);

	//put div on page
	div.appendChild(orderInfo);

}

//add item to order
function addToOrder(itemInfo){
	for(let i = 0; i < curOrder.itemDivs.length; ++i){
		if(curOrder.itemDivs[i].info.id === itemInfo.name){
			let info = curOrder.itemDivs[i].info;
			info.value++;
			info.innerHTML = itemInfo.name + ' x' + info.value + ' ($' + (itemInfo.price * info.value).toFixed(2) + ')';
			curOrder.updatePrice(itemInfo.price);
			createOrderInfo();
			return;
		}
	}

	//create new div
	let newItem = document.createElement('div');
	newItem.id = itemInfo.name;
	
	//item info
	let info = document.createElement('p');
	info.id = itemInfo.name;
	info.value = 1;
	info.innerHTML = itemInfo.name + ' x' + info.value + ' ($' + itemInfo.price + ')';
	info.classList.add('ItemName');
	info.classList.add('Item');
	info.price = itemInfo.price;
	
	//remove button
	let remove = document.createElement('img');
	remove.addEventListener('click', function(){removeFromOrder(itemInfo)});
	remove.src = '/remove.png'
	remove.classList.add('RemoveButton');

	//add new elements to curOrder
	curOrder.addItem({'info': info, 'remove': remove});
	curOrder.updatePrice(itemInfo.price);
	createOrderInfo();
}

//remove item from order
function removeFromOrder(itemInfo){
	for(let i = 0; i < curOrder.itemDivs.length; ++i){
		//find item to remove
		if(curOrder.itemDivs[i].info.id === itemInfo.name){
			let info = curOrder.itemDivs[i].info;
			if(info.value > 1){
				//lower item count
				info.value--;
				info.innerHTML = itemInfo.name + ' x' + info.value + ' ($' + itemInfo.price + ')';
			}
			else{
				//remove all related item info
				curOrder.removeItem(i);

			}

			//refresh
			curOrder.updatePrice(itemInfo.price * (-1));
			createOrderInfo();
			return;
		}
	}
}

//checkout with the current order
function checkout(){
	let orderInfo = {};
	orderInfo[restaurant.id] = {}
	orderInfo.customerInfo = {};
	orderInfo.customerInfo.items = {};
	curOrder.itemDivs.forEach(item => {
		orderInfo[restaurant.id][item.info.id] = item.info.value
		orderInfo.customerInfo.items[item.info.id] = item.info.value
	});
	orderInfo[restaurant.id].value = parseFloat(curOrder.total)
	
	orderInfo.customerInfo.total = parseFloat(curOrder.total);
	orderInfo.customerInfo.restaurant = restaurant.name;
	orderInfo.customerInfo.subtotal = parseFloat(curOrder.subtotal);
	orderInfo.customerInfo.delivery = parseFloat(curOrder.deliveryFee);
	orderInfo.customerInfo.tax = parseFloat(curOrder.tax);

	//send order to the server and start a new order
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4 && this.status==201){
			result = JSON.parse(this.responseText)
			getUser(result.user, result.order);
		}
	};
	xhttp.open("PUT", "/orders", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(orderInfo));
}

function getUser(user, order){
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			result = JSON.parse(this.responseText)
			result.orders.push(order);
			updateUser(result);
		}
	};
	xhttp.open("GET", "/users/" + user, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

function updateUser(user){
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4 && this.status==201){
			alert("Your order has been submitted");
			curOrder = new Order(restaurant.delivery_fee, restaurant.min_order);
			createOrderInfo();
		}
	};
	xhttp.open("PUT", "/users/" + user._id, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(user));
}
