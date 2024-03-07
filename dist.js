var weatherData = {};

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
      weatherData = data;
      console.log(weatherData);
      updateWeatherDashboard();
    })
    .catch((error) => {
      console.error(error);
    });
}


function updateWeatherDashboard() {
  try {
    var temperature = document.getElementById("temperature");
    var informationTime = document.getElementById("information-time");
    var windSpeed = document.getElementById("wind-speed");
    var windDirection = document.getElementById("wind-direction");
    var windDirectionArrow = document.getElementById("arrowImg");
    var feelsLike = document.getElementById("feels-like");
    var feelsLikeVariation = document.getElementById("feels-like-variation");
    var relativeHumidity = document.getElementById("relative-humidity");
    var relativeHumidityQuality = document.getElementById("relative-humidity-variation");
    var pressure = document.getElementById("pressure");
    var pressureVariation = document.getElementById("pressure-variation");

    var updatedTemperature = Math.round(weatherData.temperature);
    temperature.innerText = "".concat(updatedTemperature, "\xBAC");
    var updatedTime = weatherData.createdAt.substring(11, 16);
    var hours = updatedTime.substring(0, 2);
    var period = hours > 11 ? "PM" : "AM";
    if (period === "PM")
      updatedTime =
        (hours != 12 ? hours - 12 : 12) + updatedTime.substring(2, 5);
    informationTime.innerText = "Ultima atualiza\xE7\xE3o: "
      .concat(updatedTime)
      .concat(period);
    var updatedWindSpeed = Math.round(weatherData.wind_speed * 3.6);
    updatedWindSpeed = updatedWindSpeed <= 30.0 ? updatedWindSpeed : 5.0;
    var newWindSpeedTag = "<p id='wind-speed'>".concat(
      updatedWindSpeed,
      " <span class='unit'>km/h</span></p>"
    );
    windSpeed.innerHTML = newWindSpeedTag;
    var direction = weatherData.wind_direction - 180;
    if (direction < 0) direction += 360;
    direction = 0;
    var mapDirection = Math.floor(direction / 22.5);
    console.log(mapDirection);
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
    var thermalSensation =
      33 +
      ((10 * Math.sqrt(updatedWindSpeed) + 10.45 - updatedWindSpeed) *
        (updatedTemperature - 33)) /
        22.0;
    feelsLike.innerText = "".concat(Math.round(thermalSensation), "\xBAC");
    relativeHumidity.innerText = "".concat(
      Math.round(weatherData.humidity_rel),
      "%"
    );
    if (weatherData.humidity_rel > 60)
      relativeHumidityQuality.innerText = "Alta";
    else if (weatherData.humidity_rel > 40)
      relativeHumidityQuality.innerText = "Ideal";
    else relativeHumidityQuality.innerText = "Baixa";
    var newPressureTag = "<p id='pressure'>".concat(
      Math.round(weatherData.air_pressure),
      " <span class='unit'>hPa</span></p>"
    );
    pressure.innerHTML = newPressureTag;
  } catch (err) {
    console.log(err);
  }
}

fetchWeatherData();
