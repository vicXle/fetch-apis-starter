//using the openweathermap.org API for this activity

"use strict";

// to update the year in the copyright statement in the footer
function updateCopyright(){
	let now = new Date();
	let span = document.querySelector("footer span");

	span.innerHTML = now.getFullYear();
}

// API reference: https://openweathermap.org/api/one-call-api
// endpoint: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=alerts&appid=a15726f63f7b415988e2c41e7ec4ccee&units=imperial
// for images with weather: http://openweathermap.org/img/wn/10d@2x.png (where 10d is the image to return/display)

// values we're using for current weather:
// location - ex: America/Phoenix
// temp - ex: 82.8 degrees fahrenheit
// feels like - ex: 81.16
// weather description - ex: "Cloudy"
// weather icon - ex: Image, see info in comment above

// values we're using for forecast:
// day of the week
// low temp 
// high temp
// weather description - ex: "Clear"
// weather icon - ex: Image, see info in comment above

//function to display the weather to the page
function displayData(data){
	//build image URL base
	let imgUrlStart = "http://openweathermap.org/img/wn/";
	let imgUrlEnd = "@2x.png";
	let currentIcon = data.current.weather[0].icon;
	let imageUrl = `${imgUrlStart}${currentIcon}${imgUrlEnd}`;

	//element to display current weather
	let current = document.getElementById("current");
	//element to display 7 day forecast
	let forecast = document.getElementById("forecast");

	//the current weather
	let currentHTML = `
		<h3>${data.timezone}</h3>
		<img src="${imageUrl}" alt="${data.current.weather[0].description}">
		<p>
			<b>Current Weather: </b>${Math.round(data.current.temp)}&deg;F and ${data.current.weather[0].main}
		</p>
	`;

	current.innerHTML = currentHTML;

	let forecastHTML = "";

	//the upcoming forecast
	for(let day of data.daily){
		let iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

		let ms = day.dt * 1000;
		let date = new Date(ms);

		let forecastHTML = `
		<section class="day">
			<img src="${iconUrl}" alt="${day.weather[0].description}">
			<h3>${date.toLocaleString("en-us", {weekday: "long"})}</h3>

			<p><b>High: </b>${Math.round(day.temp.max)}&deg;F</p>
			<p><b>Low: </b>${Math.round(day.temp.min)}&deg;F</p>
			<p>${day.weather[0].main}</p>
		</section>
	`;

		forecast.innerHTML += forecastHTML;
	}
}

//build URL for API call
function getWeather(location){
	// variables for the parts of our endpoint
	let urlStart = "https://api.openweathermap.org/data/2.5/onecall?lat=";
	let urlParam1 = "&lon=";
	let urlMid = "&exclude=alerts&appid=";
	let apiKey = "a15726f63f7b415988e2c41e7ec4ccee";
	let urlEnd = "&units=imperial";

	// storing the data about the user's location, used in the endpoint
	let latitude = location.coords.latitude;
	let longitude = location.coords.longitude;

	// building our endpoint from the parts above
	let url = `${urlStart}${latitude}${urlParam1}${longitude}${urlMid}${apiKey}${urlEnd}`;


	//fetch call to API
	fetch(url)
		.then(Response => Response.json())
		.then(data => {
			console.log(data);
			displayData(data);
		})
		.catch(err => console.error(err.message));
}

//on page load, get geolocation
window.addEventListener("load", function(){
	//get user's geolocation to use to return weather for that location
	//user will have to agree to allow this access, may need to use FIrefox
	if(!navigator.geolocation) {
		document.getElementById("forecast").textContent = 'Geolocation is not supported by your browser';
	} else {
		navigator.geolocation.getCurrentPosition(getWeather);
	}

	// call the function to update the copyright year in the footer
	updateCopyright();
});
