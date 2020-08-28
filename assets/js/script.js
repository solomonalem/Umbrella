//  kAPI_KEY     68f1c698b646d5bab0694b00dc704137

//  var apiUrl =
// "https://api.openweathermap.org/data/2.5/forecast?q=" +
// cityName +
// "&appid=68f1c698b646d5bab0694b00dc704137";

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
var bodyContainer = document.querySelector(".container-body");
var mainBody = document.querySelector(".main-body");
var cityName = document.querySelector("#city-name");
var cityDate = document.querySelector("#city-date");
var cityInputName = document.querySelector("#city-input");
var searchButton = document.querySelector("#city-form");
var currentWeather = document.querySelector("#current-weather");

var getCityWeather = function (city) {
  var apiCurrentUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=68f1c698b646d5bab0694b00dc704137";

  // format the github api url
  console.log("clicked");
  // make a get request to url
  fetch(apiCurrentUrl).then((response) => {
    response.json().then((data) => {
      // call diaplay current weather
      console.log(data);
      console.log(data.main.temp);
      console.log(data.main.humidity);
      displayCurrentWeather(data);
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
  cityName.textContent = currentData.name;
  cityDate.classList = "mb-3 ml-2";
  cityDate.textContent = moment().format("LL");

  var tempEl = document.createElement("p");
  tempEl.classList = "d-block ml-2";
  tempEl.textContent = `Temperature : ${currentData.main.temp} F`;
  //   tempEl.textContent = currentData.main.temp;

  var humidityEl = document.createElement("p");
  humidityEl.classList = "d-block ml-2";
  humidityEl.textContent = `Humidity : ${currentData.main.humidity} %`;

  var speedEl = document.createElement("p");
  speedEl.classList = "d-block ml-2";
  speedEl.textContent = `Speed : ${currentData.wind.speed} mph`;

  currentWeather.appendChild(tempEl);
  currentWeather.appendChild(humidityEl);
  currentWeather.appendChild(speedEl);
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
