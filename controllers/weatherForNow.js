const fetch = require('node-fetch');
const WToken = process.env.WEATHER_TOKEN

async function weatherForNow(city) {
     const info = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WToken}`)
        .then(function (resp){return resp.json()})
        .then(function(data) {
            return data
        })
        .catch(function (err){
            return `err`
        });

    // console.log(info)
    const lat = info[0]['lat'],
        lon = info[0]['lon']

    const data = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WToken}`)
        .then(function (resp){return resp.json()})
        .then(function(data) {
            /*const weatherList =`Погода за вікном️\n🏘️ Місто : ${city}\n🌡️ Температура : ${Math.round(data.main.temp-273)}°\n🪁 На вулиці : ${data.weather[0]['description']}`
            return weatherList*/

            return data
        })
        .catch(function (err){
            return `Таке міста не існує, спробуйте ще раз!`
        });

    console.log(data.list[0])
    return "-_-"

}

module.exports = {weatherForNow}
