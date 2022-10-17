require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')
const controllers = require('./controllers/index')
const fetch = require("node-fetch");

const token = process.env.TELEGRAM_TOKEN

const bot = new TelegramApi(token, {polling: true})

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: "start!"}
    ])

    bot.on('message', async msg =>{
        const text = msg.text
        const chatId = msg.chat.id
         const weatherList = await controllers.weatherForNow(text)
       // // bot.sendPhoto(chatId, 'https://img.icons8.com/office/344/cloud.png',  {caption : weatherList[1]})
        for(let i = 0; i < weatherList.length; i++){
           bot.sendMessage(chatId, weatherList[i])
        }
        return console.log(`done!`);
    })
}

start();