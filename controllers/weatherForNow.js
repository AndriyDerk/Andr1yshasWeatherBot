const fetch = require('node-fetch');
const WToken = process.env.TOKEN

module.exports = function(city) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},ua&appid=${WToken}&lang=ua`)
        .then(function (resp){return resp.json()})
        .then(function(data) {
            console.log(data)
            const weatherList =`Погода за вікном️\n🏘️ Місто : ${city}\n🌡️ Температура : ${Math.round(data.main.temp-273)}°\n🪁 На вулиці : ${data.weather[0]['description']}`
            return weatherList
        })
        .catch(function (err){
            return `Таке міста не існує, спробуйте ще раз!`
        });
}
