function showPassword() {
    var x = document.getElementById("password-input");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function changeImage() {
    let x = document.getElementById("login_image");

    x.classList.add("hidden");
    
    setTimeout(function() {
        
        if (x.getAttribute('src') == "/frontend/images/dorm_1.jpg") {
            x.src = "/frontend/images/dorm_2.jpg";
        } else if (x.getAttribute('src') == "/frontend/images/dorm_2.jpg") {
            x.src = "/frontend/images/dorm_3.jpg";
        } else {
            x.src = "/frontend/images/dorm_1.jpg";
        }
        x.classList.remove("hidden");
        
    }, 500);
}

setInterval(changeImage, 10000);