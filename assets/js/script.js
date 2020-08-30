//  kAPI_KEY     68f1c698b646d5bab0694b00dc704137

var bodyContainer = document.querySelector(".container-body");
var mainBody = document.querySelector(".main-body");
var searchBody = document.querySelector("#search-body");
var currentWeather = document.querySelector("#current-weather");
var forecastCards = document.querySelector("#forecast-cards");
var card = document.querySelector(".card");

var cityName = document.querySelector("#city-name");
var cityDate = document.querySelector("#city-date");

var headingForecast = document.querySelector("#heading-forecast");
var headingSearch = document.querySelector("#heading-search");
var cityInputName = document.querySelector("#city-input");
var searchButton = document.querySelector("#city-form");
var changeModeBtn = document.querySelector("#mode");
var navBar = document.querySelector("#nav");
var cardEl = document.createElement("div");

// get darkModeState from local storage
var darkModeState = localStorage.getItem("darkMode");

var getCityWeather = function (city) {
  var apiCurrentUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=68f1c698b646d5bab0694b00dc704137";

  var apiForecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=68f1c698b646d5bab0694b00dc704137";

  // make a get request to url
  fetch(apiCurrentUrl).then((response) => {
    response.json().then((data) => {
      // call diaplay current weather
      displayCurrentWeather(data);

      var lat = data.coord.lat;
      var lon = data.coord.lon;
      //   console.log(lat, lon);
      var apiUvUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=68f1c698b646d5bab0694b00dc704137&lat=${lat}&lon=${lon}`;

      fetch(apiUvUrl).then((response) => {
        response.json().then((data) => {
          checkUvValue(data);
        });
      });
    });
  });
  fetch(apiForecastUrl).then((response) => {
    response.json().then((data) => {
      // call diaplay forecast weather

      displayForecastWeather(data);
    });
  });

  // call enable if the
  darkModeState = localStorage.getItem("darkMode");
  if (darkModeState === "enabled") {
    setTimeout(enableDark, 300);
    // enableDark();
  }
};

var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value from input element
  var cityName = cityInputName.value.trim();

  if (cityName) {
    getCityWeather(cityName);
    // save it to local storage
    addToLocalStorageArray(cityName);

    cityInputName.value = "";
  } else {
    alert("Please enter a correct city name");
  }
};

// ========   save to  local storage==================================

// var saveToLocalStorage = function(data){
//     // our array
// var cities = [];

// // push data to the array
// cities.push(data);
//
// // storing our array as a string
// localStorage.setItem("searchedCities", JSON.stringify(cities));
//
// // retrieving our data and converting it back into an array
// // var retrievedData = localStorage.getItem("searchedCities");

// // var cities2 = JSON.parse(retrievedData);
// }
var addToLocalStorageArray = function (cityName) {
  var cities = [];

  // Get the existing data
  var cities = localStorage.getItem("searchedCities");

 
  // If no cities data, create an array

  // Otherwise, convert the localStorage string to an array
  cities = cities ? cities.split(",") : [];

  // Add new data to localStorage Array if there is an item in it
  if (cities.length > 0) {
    if (cities.indexOf(cityName) === -1) {
      
      cities.push(cityName);
    }
  }
  // if cities is empty push cityname
  if (cities.length === 0) {
    cities.push(cityName);
  }
  

  // Save back to localStorage
  localStorage.setItem("searchedCities", cities.toString());
  console.log(cities);
};

var displayCurrentWeather = function (currentData) {
  currentWeather.textContent = "";

  //   icon
  var iconCode = currentData.weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

  //create span for icon
  var iconEl = document.createElement("img");
  iconEl.setAttribute("src", iconUrl);
  iconEl.classList = "ml-5";

  darkModeState = localStorage.getItem("darkMode");
  if (darkModeState === "enabled") {
    cityName.classList = "row mb-4 ml-2 d-block text-color-light";
  }
  // create h2 element for city name and add classlist
  cityName.classList = "row mb-4 ml-2 d-block";
  cityName.textContent = currentData.name;

  // create h6 element for city date and format the date

  cityDate.classList = "ml-1 d-block";
  cityDate.textContent = moment().format("LL");

  // append the date to the name header
  cityName.appendChild(iconEl);
  cityName.appendChild(cityDate);

  // create p element for temp, add class to it and assign value
  var tempEl = document.createElement("p");
  tempEl.classList = "d-block ml-2";
  tempEl.textContent = `Temperature : ${currentData.main.temp} °F`;

  // create p element for humidity, add class to it and assign value
  var humidityEl = document.createElement("p");
  humidityEl.classList = "d-block ml-2";
  humidityEl.textContent = `Humidity : ${currentData.main.humidity} %`;

  // create p element for speed, add class to it and assign value
  var speedEl = document.createElement("p");
  speedEl.classList = "d-block ml-2";
  speedEl.textContent = `Speed : ${currentData.wind.speed} mph`;

  // append all to the current weather container
  currentWeather.appendChild(cityName);
  currentWeather.appendChild(tempEl);
  currentWeather.appendChild(humidityEl);
  currentWeather.appendChild(speedEl);
};

// ==========  CHECK UV  ==============================================================================================

var checkUvValue = function (uvData) {
  var uvValue = uvData.value;
  // create p element for
  var uvIndexEL = document.createElement("p");
  uvIndexEL.classList = "d-block ml-2 ";

  // create span element for uv -value
  var uvEl = document.createElement("span");
  uvEl.textContent = uvValue;

  // check and classifay as severe moderate and low
  if (uvValue < 3) {
    uvEl.classList = "bg-success rounded px-2 py-1";
  } else if (uvValue >= 3 && uvValue < 7) {
    uvEl.classList = "bg-warning rounded px-2 py-1";
  } else {
    uvEl.classList = "bg-danger rounded px-2 py-1";
  }

  uvIndexEL.textContent = "UV Index : ";
  // append uv value to uv term
  uvIndexEL.appendChild(uvEl);

  // append uv element to the page
  currentWeather.appendChild(uvIndexEL);
};

//========   DISPLAY FORECAST  ==================================================================================================

var displayForecastWeather = function (forecastData) {
  forecastCards.textContent = "";

  for (var i = 0; i < forecastData.list.length; i += 8) {
    var datum = forecastData.list[i];
    var dateFormated = moment(datum.dt_txt.split(" ")[0]).format("L");
    var tempForecastValue = datum.main.temp;
    var humidity = datum.main.humidity;

    //create div element
    var cardEl = document.createElement("div");
    cardEl.classList = "card mr-2 mb-2 col-xs-12 ";

    // card header----------------------
    var cardHeader = document.createElement("div");
    cardHeader.classList = "card-header";
    cardHeader.textContent = dateFormated;

    // card body--------------------
    var cardBody = document.createElement("div");
    cardBody.classList = "card-body";

    // create p element for temp
    var tempForecastEL = document.createElement("p");
    tempForecastEL.classList = "d-block ml-4";
    tempForecastEL.textContent = `${tempForecastValue} °F`;

    // create p element for humidity°
    var humidityForecastEL = document.createElement("p");
    humidityForecastEL.classList = "d-block";
    humidityForecastEL.textContent = `Humidity: ${humidity} %`;

    //   icon
    var iconCode = datum.weather[0].icon;

    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

    //create span
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", iconUrl);
    iconEl.classList = "ml-4";

    // append to the card-body
    cardBody.appendChild(iconEl);
    cardBody.appendChild(tempForecastEL);
    cardBody.appendChild(humidityForecastEL);

    // append card -header and card body to card
    cardEl.appendChild(cardHeader);
    cardEl.appendChild(cardBody);

    // append it to the
    forecastCards.appendChild(cardEl);
  }
};
var enableDark = function () {
  // get html collections

  var card = document.getElementsByClassName("card");
  var currentWeatherP = document.querySelectorAll("#current-weather p");

  Array.from(currentWeatherP).forEach((el) => {
    //   el.clasList.remove('current-weather p');
    el.classList.add("p-color");
  });

  // change htmlCollections to array
  Array.from(card).forEach(function (el) {
    el.classList.add("bg-card");
  });

  headingForecast.classList.remove("text-color-dark");
  headingSearch.classList.remove("text-color-dark");
  cityName.classList.remove("text-color-dark");
  cityDate.classList.remove("text-color-dark");

  headingForecast.classList.add("text-color-light");
  headingSearch.classList.add("text-color-light");
  cityName.classList.add("text-color-light");
  cityDate.classList.add("text-color-light");

  bodyContainer.classList.add("bg-container-body");
  currentWeather.classList.add("bg-current-day");
  searchBody.classList.add("bg-search-body");
  searchBody.classList.remove("border");
  navBar.classList.add("bg-nav");

  cityInputName.classList.add("bg-input");

  // save it in localstorage

  localStorage.setItem("darkMode", "enabled");
};

//==---------------------------- DISABLE ------------------================================================================
var disableDark = function () {
  // get html collections
  var card = document.getElementsByClassName("card");
  var currentWeatherP = document.querySelectorAll("#current-weather p");

  Array.from(currentWeatherP).forEach((el) => {
    //   el.clasList.remove('current-weather p');
    el.classList.remove("p-color");
  });

  // change htmlCollections to array
  Array.from(card).forEach(function (el) {
    el.classList.remove("bg-card");
  });
  headingForecast.classList.remove("text-color-light");
  headingSearch.classList.remove("text-color-light");
  cityName.classList.remove("text-color-light");
  cityDate.classList.remove("text-color-light");

  headingForecast.classList.add("text-color-dark");
  headingSearch.classList.add("text-color-dark");
  cityName.classList.add("text-color-dark");
  cityDate.classList.add("text-color-dark");

  bodyContainer.classList.remove("bg-container-body");
  currentWeather.classList.remove("bg-current-day");
  searchBody.classList.remove("bg-search-body");
  searchBody.classList.remove("border");
  navBar.classList.remove("bg-nav");

  // save it in localstorage

  localStorage.setItem("darkMode", null);
};

// call enable if the
darkModeState = localStorage.getItem("darkMode");
if (darkModeState === "enabled") {
  enableDark();
}

var changeModeColor = function () {
  // get darkModeState from local storage
  darkModeState = localStorage.getItem("darkMode");
  if (darkModeState === "enabled") {
    // enableDark();
    disableDark();
  } else {
    enableDark();
  }
};

searchButton.addEventListener("submit", formSubmitHandler);

changeModeBtn.addEventListener("click", changeModeColor);
