const fetch = require('node-fetch');
const WToken = process.env.WEATHER_TOKEN

const weatherPic = {
    'Clear' : '☀',
    'Thunderstorm' : '⛈',
    'Drizzle' : '🌫',
    'Rain' : '🌧',
    'Snow' : '🌨',
    'Clouds' : '☁',
    'Mist' : '🌫',
    'Smoke' : '🌫',
    'Haze' : '🌫',
    'Fog' : '🌫',
    'Sand' : '🌫',
    'Dust' : '🌫',
    'Ash' : '🌫',
    'Squall' : '🌫',
    'Tornado' : '🌪',
    'None' : '❔'
}

async function weatherForNow(city) {
    const info = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WToken}`)
        .then(function (resp){return resp.json()})
        .then(function(data) {
            return data
        })
        .catch(function (err){
            return `err`
        });

    const lat = info[0]['lat'],
        lon = info[0]['lon'];
    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WToken}`)
        .then(function (resp){return resp.json()})
        .then(function(data) {
            return data
        })
        .catch(function (err){
            return `Таке міста не існує, спробуйте ще раз!`
        });
    const weatherList = `🌡Temp : ${Math.round(data.main.temp - 273)}°\n${weatherPic[data.weather[0]['main']]}Description : ${data.weather[0]['description']}`
    return weatherList
}


module.exports = {weatherForNow}
