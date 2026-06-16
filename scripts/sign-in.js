function changeImage() {
    let x = document.getElementById("page-image");
    let y = x.getAttribute("src");

    x.classList.add("fade-out");

    setTimeout(() => {
        
        switch (y) {
            case "/frontend/images/sign-up-1.jpg": x.setAttribute("src", "/frontend/images/sign-up-5.jpg"); break;
            case "/frontend/images/sign-up-2.jpg": x.setAttribute("src", "/frontend/images/sign-up-6.jpg"); break;
            case "/frontend/images/sign-up-3.jpg": x.setAttribute("src", "/frontend/images/sign-up-7.jpg"); break;
            case "/frontend/images/sign-up-4.jpg": x.setAttribute("src", "/frontend/images/sign-up-8.jpg"); break;
            case "/frontend/images/sign-up-5.jpg": x.setAttribute("src", "/frontend/images/sign-up-9.jpg"); break;
            case "/frontend/images/sign-up-6.jpg": x.setAttribute("src", "/frontend/images/sign-up-1.jpg"); break;
            case "/frontend/images/sign-up-7.jpg": x.setAttribute("src", "/frontend/images/sign-up-2.jpg"); break;
            case "/frontend/images/sign-up-8.jpg": x.setAttribute("src", "/frontend/images/sign-up-3.jpg"); break;
            case "/frontend/images/sign-up-9.jpg": x.setAttribute("src", "/frontend/images/sign-up-4.jpg"); break;
            default: x.setAttribute("src", "/frontend/images/sign-up-5.jpg"); break;
        }

        x.classList.remove("fade-out");
        
    }, 500); 
}

setInterval(changeImage, 8000);