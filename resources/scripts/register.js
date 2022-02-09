document.getElementById('register').addEventListener('click', register);

//validates new user credentials
function register(){
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let data = {'username': username, 'password': password};

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            login(JSON.parse(this.responseText));
            return;
        }
        if(this.readyState==4 && this.status==418){
            alert('Username already taken');
            return;
        }
    };
    xhttp.open("POST", "/users", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}

//logs registered user in
function login(user){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            window.location.replace('/users/' + user._id);
            return;
        }
    };
    xhttp.open("PUT", "/login/" + user._id, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(user));
}