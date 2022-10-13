require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')
const controllers = require('./controllers/weatherForNow')

const token = '5591656130:AAEJHq38gFhuO8UfgCJulggcAcY9TBfEhZ8'

const bot = new TelegramApi(token, {polling: true})

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: "start!"}
    ])

    bot.on('message', async msg =>{
        const text = msg.text
        const chatId = msg.chat.id
        const weatherList = await controllers(text)
        console.log(weatherList)
        return bot.sendMessage(chatId, weatherList)
    })
}

start();