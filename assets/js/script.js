//  kAPI_KEY

var bodyContainer = document.querySelector(".container-body");
var mainBody = document.querySelector(".main-body");
var searchBody = document.querySelector("#search-body");
var currentWeather = document.querySelector("#current-weather");
var forecastCards = document.querySelector("#forecast-cards");
var card = document.querySelector(".card");
var lastSearchedEl = document.querySelector("#last-searched");

var cityName = document.querySelector("#city-name");
var cityDate = document.querySelector("#city-date");

var headingForecast = document.querySelector("#heading-forecast");
var headingSearch = document.querySelector("#heading-search");
var cityInputName = document.querySelector("#city-input");
var searchButton = document.querySelector("#city-form");
var changeModeBtn = document.querySelector("#mode");
var navBar = document.querySelector("#nav");
var navItem = document.querySelector(".nav-item");
var cardEl = document.createElement("div");

// get darkModeState from local storage
var darkModeState = localStorage.getItem("darkMode");

var apiKey = config.API_KEY;

var getCityWeather = function (city) {
  var apiCurrentUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;

  var apiForecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;

  // make a get request to url
  fetch(apiCurrentUrl).then((response) => {
    response.json().then((data) => {
      // call diaplay current weather
      displayCurrentWeather(data);

      var lat = data.coord.lat;
      var lon = data.coord.lon;
      //   console.log(lat, lon);
      var apiUvUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;

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
    setTimeout(enableDark, 400);
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
    saveToLocalStorage(cityName);

    cityInputName.value = "";
  } else {
    alert("Please enter a correct city name");
  }
};
// ========  SAVE TO LOCALSTORAGE     -------------------------------------------------

var saveToLocalStorage = function (cityName) {
  var cities = [];

  // Get the existing data
  var cities = localStorage.getItem("searchedCities");

  // If no cities data, create an array

  // Otherwise, convert the localStorage string to an array
  cities = cities ? cities.split(",") : [];

  // Add new data to localStorage Array if there is an item in it
  if (cities.length > 0 && cities.length <= 8) {
    if (cities.indexOf(cityName) === -1) {
      cities.push(cityName);
    }
  }
  // if array length reaches max and the item is not on the array replace it with the last one
  if (cities.length > 8) {
    if (cities.indexOf(cityName) === -1) {
      cities.splice(8, 1, cityName);
    }
  }

  // if cities is empty push cityname
  if (cities.length === 0) {
    cities.push(cityName);
  }
  // if cities is empty push cityname

  // Save back to localStorage
  localStorage.setItem("searchedCities", cities.toString());

  loadWeatherApp();
};

// -------------- DISPLAY CURRENT WEATHER -------------------------------------

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

// ==========  CHECK UV INDEX ==============================================================================================

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

//========   DISPLAY FORECAST  =================================================================================================

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

// -----------  ENABLE DARK MODE ------------------------------------------------------

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

  // remove all dark - colors from heading class
  headingForecast.classList.remove("text-color-dark");
  headingSearch.classList.remove("text-color-dark");
  cityName.classList.remove("text-color-dark");
  cityDate.classList.remove("text-color-dark");

  // add light text-color to headings
  headingForecast.classList.add("text-color-light");
  headingSearch.classList.add("text-color-light");
  cityName.classList.add("text-color-light");
  cityDate.classList.add("text-color-light");

  // add dark background to containers
  bodyContainer.classList.add("bg-container-body");
  currentWeather.classList.add("bg-current-day");
  searchBody.classList.add("bg-search-body");

  //remove border and nav background
  searchBody.classList.remove("border");
  navBar.classList.add("bg-nav");

  cityInputName.classList.add("bg-input");

  // change togglers text
  navItem.textContent = `Light-mode`;
  navItem.appendChild(changeModeBtn);

  // save it in localstorage

  localStorage.setItem("darkMode", "enabled");
};

//==---------------------------- DISABLE DARK MODE ------------------================================================================
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

  // remove all light - colors from heading class
  headingForecast.classList.remove("text-color-light");
  headingSearch.classList.remove("text-color-light");
  cityName.classList.remove("text-color-light");
  cityDate.classList.remove("text-color-light");

  // add dark - colors for all heading classes
  headingForecast.classList.add("text-color-dark");
  headingSearch.classList.add("text-color-dark");
  cityName.classList.add("text-color-dark");
  cityDate.classList.add("text-color-dark");

  // remove all dark - backgrounds from containers
  bodyContainer.classList.remove("bg-container-body");
  currentWeather.classList.remove("bg-current-day");
  searchBody.classList.remove("bg-search-body");
  searchBody.classList.add("border");
  navBar.classList.remove("bg-nav");

  cityInputName.classList.remove("bg-input");

  //change toggler text
  navItem.textContent = `Dark-mode`;
  navItem.appendChild(changeModeBtn);

  // save it in localstorage

  localStorage.setItem("darkMode", null);
};

// call enable if the
darkModeState = localStorage.getItem("darkMode");
if (darkModeState === "enabled") {
  enableDark();
}
//  -----   CHANGE MODE COLOR ----------------------------------------
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

var loadWeatherApp = function () {
  var cities = localStorage.getItem("searchedCities");
  cities = cities ? cities.split(",") : [];

  renderSearchedCities();
};

// -----   RENDER SEARCHED CITIES -----------------------------------

var renderSearchedCities = function () {
  var arrayOfCities = localStorage.getItem("searchedCities");
  arrayOfCities = arrayOfCities ? arrayOfCities.split(",") : [];

  // clear first the previous cities from the UI
  lastSearchedEl.textContent = "";

  for (var i = arrayOfCities.length - 1; i >= 0; i--) {
    // create p element
    var searchedEl = document.createElement("p");

    searchedEl.classList.add("p-2");
    searchedEl.classList.add("border");

    searchedEl.classList.add("m-1");
    searchedEl.textContent = arrayOfCities[i];

    lastSearchedEl.appendChild(searchedEl);
    searchBody.appendChild(lastSearchedEl);
  }
};

// get element ---------------------
var getElement = function (event) {
  var city = event.target.innerText;

  getCityWeather(city);
};

loadWeatherApp();

searchButton.addEventListener("submit", formSubmitHandler);

changeModeBtn.addEventListener("click", changeModeColor);

lastSearchedEl.addEventListener("click", getElement);
