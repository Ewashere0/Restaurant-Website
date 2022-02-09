let input = document.getElementById('private')
input.addEventListener('click', setPrivacy);

//changes a user's privacy
function setPrivacy(){
    user.privacy = input.checked;
    let xhttp = new XMLHttpRequest();
    
    xhttp.open("PUT", "/users/" + user._id, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(user));
}