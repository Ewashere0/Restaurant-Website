document.getElementById('login').addEventListener('click', getUsers);

//requests all users as json
function getUsers(){
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            data = JSON.parse(this.responseText);
            login(username, password, data);
        }
    };
    xhttp.open("GET", "/users", true);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send();
}

//validates new user credentials
function login(username, password, users){
    for(const user in users){
        if(users[user].username === username && users[user].password === password){
            loginid(users[user]);
            return;
        }
    }
    alert('Invalid credentials');
}

//logs user in
function loginid(user){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            window.location.replace('/');
            return;
        }
    };
    xhttp.open("PUT", "/login/" + user._id, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(user));
}