//  kAPI_KEY     68f1c698b646d5bab0694b00dc704137

var bodyContainer = document.querySelector(".container-body");
var mainBody = document.querySelector(".main-body");
// var cityName = document.querySelector("#city-name");
// var cityDate = document.querySelector("#city-date");
var cityInputName = document.querySelector("#city-input");
var searchButton = document.querySelector("#city-form");
var currentWeather = document.querySelector("#current-weather");
var forecastCards = document.querySelector("#forecast-cards");

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
};

var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value from input element
  var cityName = cityInputName.value.trim();

  if (cityName) {
    getCityWeather(cityName);
    cityInputName.value = "";
  } else {
    alert("Please enter a correct city name");
  }
};

var displayCurrentWeather = function (currentData) {
  currentWeather.textContent = "";

  //   icon
  var iconCode = currentData.weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

  //create span
  var iconEl = document.createElement("img");
  iconEl.setAttribute("src", iconUrl);
  iconEl.classList = "ml-5";

  //   cityDate.classList = "mb-3 ml-2";
  //   cityDate.textContent = moment().format("LL");

  var cityName = document.createElement("h2");
  cityName.classList = "row mb-4 ml-2 d-block";
  cityName.textContent = currentData.name;

  var cityDate = document.createElement("h6");
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
  uvIndexEL.classList = "d-block ml-2";

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

  uvIndexEL.appendChild(uvEl);

  currentWeather.appendChild(uvIndexEL);
};

//========   DISPLAY FORECAST  ==================================================================================================

var displayForecastWeather = function (forecastData) {
  //   console.log(forecastData.list);

  forecastCards.textContent = "";

  for (var i = 0; i < forecastData.list.length; i += 8) {
    var datum = forecastData.list[i];
    var dateFormated = moment(datum.dt_txt.split(" ")[0]).format("L");
    var tempForecastValue = datum.main.temp;
    var humidity = datum.main.humidity;

    //create div element
    var cardEl = document.createElement("div");
    cardEl.classList = "card mr-2";

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

searchButton.addEventListener("submit", formSubmitHandler);

// var displayRepos = function (repos, searchTerm) {
//     // check if api returned any repos
//     if (repos.length === 0) {
//       repoContainerEl.textContent = "No repositories found.";
//       return;
//     }

//     // clear old content
//     repoContainerEl.textContent = "";
//     repoSearchTerm.textContent = searchTerm;

//     // loop over repos
//     for (var i = 0; i < repos.length; i++) {
//       // format repo name
//       var repoName = repos[i].owner.login + "/" + repos[i].name;

//       // create a link for each repo
//       var repoEl = document.createElement("a");
//       repoEl.classList = "list-item flex-row justify-space-between align-center";
//       repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

//       // create a span element to hold repository name
//       var titleEl = document.createElement("span");
//       titleEl.textContent = repoName;

//       // append to container
//       repoEl.appendChild(titleEl);

//       // create a status element
//       var statusEl = document.createElement("span");
//       statusEl.classList = "flex-row align-center";

//       // check if current repo has issues or not
//       if (repos[i].open_issues_count > 0) {
//         statusEl.innerHTML =
//           "<i class='fas fa-times status-icon icon-danger'></i>" +
//           repos[i].open_issues_count +
//           " issue(s)";
//       } else {
//         statusEl.innerHTML =
//           "<i class='fas fa-check-square status-icon icon-success'></i>";
//       }

//       // append to container
//       repoEl.appendChild(statusEl);

//       // append container to the dom
//       repoContainerEl.appendChild(repoEl);
//     }
//   };
