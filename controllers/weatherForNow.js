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
        lon = info[0]['lon'];

    const data = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WToken}`)
        .then(function (resp){return resp.json()})
        .then(function(data) {
            return data
        })
        .catch(function (err){
            return `Таке міста не існує, спробуйте ще раз!`
        });
    let weatherList = [],
        list='Day : ' + data.list[0].dt_txt.slice(0,10) + "\n\n"

    for(let i = 0;i<40; i++){
        if(data.list[i].dt_txt.slice(11,13) === '00'){
            weatherList.push(list)
            list='Date : ' + data.list[i].dt_txt.slice(0,10) + "\n\n"
        }
        list +="Time : " + data.list[i].dt_txt.slice(11,16) +"\nTemp : " + Math.round(data.list[i].main.temp - 273) + "°\nDescription : " + data.list[i].weather[0]['description']+"\n\n"
    }
    return weatherList

}

module.exports = {weatherForNow}
