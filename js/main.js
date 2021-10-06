const container = document.querySelector(".container");
const inputBox = document.querySelector(".input_box");
const infoText = document.querySelector(".info");
const inputField = document.querySelector("input");
const locationBtn = document.querySelector("button");
const weatherIcon = document.querySelector(".weather_box img");
const backArrow = document.querySelector(".fa-arrow-left");

let api;

backArrow.addEventListener("click", () => {
    container.classList.remove("active");
})

inputField.addEventListener("keyup", element => {
    // If user press enter without empty value
    if(element.key === "Enter" && inputField.value !== ""){
        requestApi(inputField.value);
    }

})

locationBtn.addEventListener("click", () => {
    if(navigator.geolocation) {

        // if the getCurrentPosition() method is successful then onSuccess function will call.
        // if any error occurred while getting user location then onError function will call.
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation api");
    }
})

function onSuccess(position) {
    const apiKey = `cc3d753d882630b65eb6f97808404b92`;
    console.log(position);

    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoText.innerText = error.message;
    infoText.classList.add("error");
}

function requestApi(city) {
    const apiKey = `cc3d753d882630b65eb6f97808404b92`;
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoText.innerText = "Getting weather details...";
    infoText.classList.add("pending");

    fetch(api)
    .then(response => response.json())
    .then(data => weatherDetails(data))
}

function weatherDetails(info) {
    if(info.cod == 404){
        infoText.innerText = `${inputField.value} isn't a valid city name`;
        infoText.classList.replace("pending", "error");

    } else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        // Custom icons according to weather
        if(id == 800){
            weatherIcon.src = "/img/icons/clear.svg";
        } else if ( id >= 200 && id <= 232){
            weatherIcon.src = "/img/icons/storm.svg";
        } else if ( id >= 600 && id <= 6222){
            weatherIcon.src = "/img/icons/snow.svg";
        } else if ( id >= 701 && id <= 781){
            weatherIcon.src = "/img/icons/haze.svg";
        } else if ( id >= 801 && id <= 804){
            weatherIcon.src = "/img/icons/cloud.svg";
        } else if (( id >= 300 && id <= 321) || ( id >=500 && id <= 531 )){
            weatherIcon.src = "/img/icons/rain.svg";
        }

        container.querySelector(".temp .numb").innerText = Math.floor(temp);
        container.querySelector(".weather").innerText = description.toUpperCase();
        container.querySelector(".location span").innerText = `${city}, ${country}`;
        container.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        container.querySelector(".humidity span").innerText = `${humidity}%`;


        infoText.classList.remove("pending", "error");
        container.classList.add("active");
        console.log(info);
    }

}