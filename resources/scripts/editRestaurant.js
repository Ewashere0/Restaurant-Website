//event listeners for buttons
document.getElementById('addCat').addEventListener('click', addCat);
document.getElementById('addItem').addEventListener('click', addItem);
document.getElementById('submit').addEventListener('click', submit);

function addCat(){
    //get category information
    let catName = document.getElementById('catName').value;
    if(catName === ""){
        alert('enter a category name');
        return;
    }
    if(catName in restaurant.menu){
        alert('New category must be unique');
        return;
    }
    restaurant.menu[catName] = {};

    //add new category to select menu
    let catSelect = document.getElementById('catSelect');

    let newCat = document.createElement('option');
    newCat.innerHTML = catName;
    catSelect.appendChild(newCat);

    //crate new div for the category on the menu
    let newDiv = document.createElement('div');
    newDiv.id = catName;

    let catHeader = document.createElement('h3');
    catHeader.innerHTML = catName;
    newDiv.appendChild(catHeader);
    newDiv.appendChild(document.createElement('br'));

    let restoDiv = document.getElementById('menu');

    restoDiv.appendChild(newDiv);
    restoDiv.appendChild(document.createElement('br'));
    restoDiv.appendChild(document.createElement('br'));
}

function addItem(){
    //get name information
    let itemName = document.getElementById('itemName').value;
    if(itemName === ''){
        alert('Please enter an item name');
        return;
    }

    //get description information
    let description = document.getElementById('itemDescription').value;
    if(description === ''){
        alert('Please enter a description');
        return;
    }

    //get price information
    let price = document.getElementById('itemPrice').value;
    if(price === ''){
        alert('Please enter a price');
        return;
    }
    price = parseFloat(price);
    if(isNaN(price) || price < 0){
        alert('Price must be a positive number');
        return;
    }

    //create id for new item
    let numitems = 0;
    Object.keys(restaurant.menu).forEach(categoryKey =>{
        Object.keys(restaurant.menu[categoryKey]).forEach(itemKey =>{
            ++numitems;
        });
    });

    //create elements from menu div
    let nameLabel = document.createElement('p');
    nameLabel.innerHTML = itemName + '($' + price + ') id(' + numitems + ')';
    nameLabel.classList.add('Item');
    nameLabel.classList.add('ItemName')

    let descriptionLabel = document.createElement('p');
    descriptionLabel.innerHTML = description;
    descriptionLabel.classList.add('Item');

    let cat = document.getElementById('catSelect').value;
    if(cat === ''){
        alert('You must create a category');
        return;
    }
    let div = document.getElementById(cat);

    div.appendChild(nameLabel);
    div.appendChild(descriptionLabel);
    div.appendChild(document.createElement('br'));

    //add item to restaurant object
    restaurant.menu[cat][numitems] = {  'name': itemName,
                                        'description': description,
                                        'price': price}
}

function submit(){

    let name = document.getElementById('name').value;
    if(name === ''){
        alert('You must provide a restaurant name');
        return;
    }
    restaurant.name = name;

    let fee = document.getElementById('fee').value;
    if(fee === ''){
        alert('You must provide a delivery fee');
        return;
    }
    fee = parseFloat(fee);
    if(isNaN(fee) || fee < 0){
        alert('Delivery fee must be a positive number');
        return;
    }
    restaurant.delivery_fee = fee;

    let min = document.getElementById('min').value;
    if(min === ''){
        alert('You must provide a minimum order amount');
        return;
    }
    min = parseFloat(min);
    if(isNaN(min) || min < 0){
        alert('Minimum order must be a positive number');
        return;
    }
    restaurant.min_order = min;

    //send restaurant object to server
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            alert('Menu successfully updated');
        }
    };
    xhttp.open("PUT", "/restaurants/" + restaurant.id, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(restaurant));
}