var weatherData = {};
var weatherFlutuation = {};

// Função para buscar a lista de caminhos das imagens da API
function fetchWeatherData() {
  const apiUrl = `https://mackleaps.mackenzie.br/meteorologiaapi/reports/latest`;
  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar imagens da API");
      }
      return response.json();
    })
    .then((data) => {
      weatherData = data.data;
      weatherFlutuation = data.flutuation;
      updateWeatherDashboard();
    })
    .catch((error) => {
      console.error(error);
    });
}

function getThermalSensation(temperature, windSpeed) {
  return 33 + ((10 * Math.sqrt(windSpeed) + 10.45 - windSpeed) *
    (temperature - 33)) /
    22.0;
}

function updateTemperatureCard() {
  var temperature = document.getElementById("temperature");
  var informationTime = document.getElementById("information-time");
  var updatedTemperature = Math.round(weatherData.temperature);
  var updatedTime = weatherData.createdAt.substring(11, 16);
  var hours = updatedTime.substring(0, 2);
  var period = hours > 11 ? "PM" : "AM";
  temperature.innerText = "".concat(updatedTemperature, "\xBAC");
  if (period === "PM") {
    updatedTime = (hours != 12 ? hours - 12 : 12) + updatedTime.substring(2, 5);
    informationTime.innerText = "Ultima atualiza\xE7\xE3o: ".concat(updatedTime).concat(period);
  }
  return updatedTemperature;
}

function updateWindCard(){
  var windSpeed = document.getElementById("wind-speed");
  var windDirection = document.getElementById("wind-direction");
  var windDirectionArrow = document.getElementById("arrowImg");
  var updatedWindSpeed = Math.round(weatherData.wind_speed * 3.6);
  updatedWindSpeed = updatedWindSpeed <= 30.0 ? updatedWindSpeed : '-';
  var newWindSpeedTag = "<p id='wind-speed'>".concat(
    updatedWindSpeed,
    " <span class='unit'>km/h</span></p>"
  );
  windSpeed.innerHTML = newWindSpeedTag;
  var direction = weatherData.wind_direction - 180;
  if (direction < 0) direction += 360;
  var mapDirection = Math.floor(direction / 22.5);
  var cardinalDirections = [
    "N",
    "NE",
    "NE",
    "E",
    "E",
    "SE",
    "SE",
    "S",
    "S",
    "SW",
    "SW",
    "W",
    "W",
    "NW",
    "NW",
    "N",
  ];
  windDirection.innerText = cardinalDirections[mapDirection];
  windDirectionArrow.style.transform = "rotate(".concat(direction, "deg)");

  return updatedWindSpeed;
}

function updateThermalSensation(updatedTemperature, updatedWindSpeed){
  var feelsLike = document.getElementById("feels-like");
  var feelsLikeVariation = document.getElementById("feels-like-variation");
  var feelsLikeVariationImg = document.getElementById("thermal-sensation-icon");
  feelsLike.innerText = "".concat(Math.round(getThermalSensation(updatedTemperature, updatedWindSpeed)), "\xBAC");
  if (weatherFlutuation.tempStatus === "stable") {
    feelsLikeVariation.innerText = "Estável"
    feelsLikeVariationImg.src = "./img/Line 9.png"
    feelsLikeVariationImg.className = "stable2";
  } else if (weatherFlutuation.tempStatus === "rising") {
    feelsLikeVariation.innerText = "Subindo"
    feelsLikeVariationImg.src = "./img/Arrow.png"
    feelsLikeVariationImg.className = "rising";
  } else {
    feelsLikeVariation.innerText = "Caindo"
    feelsLikeVariationImg.src = "./img/Arrow.png"
    feelsLikeVariationImg.className = "dropping";
  }
}

function updateRelativeHumidity(){
  var relativeHumidity = document.getElementById("relative-humidity");
  var relativeHumidityVariation = document.getElementById("relative-humidity-variation");
  var relativeHumidityVariationImg = document.getElementById("humidity-icon");
  weatherData.humidity_rel = 50
  relativeHumidity.innerText = "".concat(
    Math.round(weatherData.humidity_rel),
    "%"
  );
  if (weatherData.humidity_rel > 60) {
    relativeHumidityVariation.innerText = "Alta";
    relativeHumidityVariationImg.src = "./img/Arrow.png";
    relativeHumidityVariationImg.className = "rising";
  } else if (weatherData.humidity_rel > 40) {
    relativeHumidityVariation.innerText = "Ideal";
    relativeHumidityVariationImg.src = "./img/Line 10.png";
    relativeHumidityVariationImg.className = "stable1";
  } else {
    relativeHumidityVariation.innerText = "Baixa";
    relativeHumidityVariationImg.src = "./img/Arrow.png";
    relativeHumidityVariationImg.className = "dropping";
  }

}

function updatePressure(){
  var pressure = document.getElementById("pressure");
  var pressureVariation = document.getElementById("pressure-variation");
  var pressureVariationImg = document.getElementById("pressure-icon");
  var newPressureTag = "<p id='pressure'>".concat(
    Math.round(weatherData.air_pressure),
    " <span class='unit'>hPa</span></p>"
  );
  pressure.innerHTML = newPressureTag;
  if (weatherFlutuation.pressureStatus === "stable") {
    pressureVariation.innerText = "Estável"
    pressureVariationImg.src = "./img/Line 9.png"
    pressureVariationImg.className = "stable2";
  } else if (weatherFlutuation.pressureStatus === "rising") {
    pressureVariation.innerText = "Subindo"
    pressureVariationImg.src = "./img/Arrow.png"
    pressureVariationImg.className = "rising";
  } else {
    pressureVariation.innerText = "Caindo"
    pressureVariationImg.src = "./img/Arrow.png"
    pressureVariationImg.className = "dropping";
  }
}

function updateWeatherDashboard() {
  try {
    var newTemperature = updateTemperatureCard();
    var newWindSpeed = updateWindCard();
    updateThermalSensation(newTemperature, newWindSpeed);
    updateRelativeHumidity();
    updatePressure();
  } catch (err) {
    console.log(err);
  }
}

fetchWeatherData();
