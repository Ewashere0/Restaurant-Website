//requests order statistics from the server
function requestData(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            data = JSON.parse(this.responseText);
            display(data)
        }
    };
    xhttp.open("GET", "/orders", true);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send();
}

//renders the requested data
function display(data){
    //divs for each statistic
    let restaurants = document.getElementById("restaurants");
    let numOrders = document.getElementById("numOrders");
    let avgOrder = document.getElementById("avgOrder");
    let popular = document.getElementById("popular");

    Object.keys(data).forEach(restaurant =>{
        //restaurant name
        let newRestaurant = document.createElement('p');
        newRestaurant.innerHTML = data[restaurant].name;
        restaurants.appendChild(newRestaurant);

        //number of orders
        let newNumOrder = document.createElement('p');
        newNumOrder.innerHTML = data[restaurant]["numOrders"];
        numOrders.appendChild(newNumOrder);

        //average cost of order (default: N/A)
        let newAvgOrder = document.createElement('p');
        if(data[restaurant]["numOrders"] !== 0){
            newAvgOrder.innerHTML = (data[restaurant]["value"] / data[restaurant]["numOrders"]).toFixed(2);
        }
        else{
            newAvgOrder.innerHTML = "N/A";
        }
        avgOrder.appendChild(newAvgOrder);

        //most popular item (default: N/A)
        let newPopular = document.createElement('p');
        if(data[restaurant]["numOrders"] !== 0){
            let max = -1;
            let maxItem = "";
            Object.keys(data[restaurant]).forEach(key =>{
                if(key !== "numOrders" && key !== "value"){
                    if(data[restaurant][key] > max){
                        max = data[restaurant][key];
                        maxItem = key;
                    }
                }
            });
            newPopular.innerHTML = maxItem;
        }
        else{
            newPopular.innerHTML = "N/A";
        }
        popular.appendChild(newPopular);
    });
}

let data
requestData(data);
