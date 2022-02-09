document.getElementById('submit').addEventListener('click', submit);

function submit(){
    //get name information
    let name = document.getElementById('name').value;
    if(name === ""){
        alert("Please provide a name");
        return;
    }

    //get delivery fee information
    let fee = document.getElementById('fee').value;
    if(fee === ""){
        alert("Please provide a delivery fee");
        return;
    }
    fee = parseFloat(fee)
    if(isNaN(fee) || fee < 0){
        alert("Delivery fee must be a positive number");
        return;
    }

    //get minimum order information
    let min = document.getElementById('min').value;
    if(min === ""){
        alert("Please provide a minimum order");
        return;
    }
    min = parseFloat(min);
    if(isNaN(min) || min < 0){
        alert("Minimum order must be a positive number");
        return;
    }

    //create restaurant object
    let newresto = {'name': name,
                    'min_order': min,
                    'delivery_fee': fee}
         
    //send object to server and redirect to
    //menu editing page for that restaurant
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            window.location.replace('/restaurants/' + id);

            //to show it happened
            console.log(JSON.parse(this.responseText));
        }
    };
    xhttp.open("POST", "/restaurants", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(newresto));
}