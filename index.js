require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')
const controllers = require('./controllers/index')
const fetch = require("node-fetch");

const token = process.env.TELEGRAM_TOKEN

const bot = new TelegramApi(token, {polling: true})

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: "start!"},
        {command: '/ss', description: "sdf"}
    ])

    bot.on('message', async msg =>{
        const text = msg.text
        const chatId = msg.chat.id
        const weatherList = await controllers.weatherForNow(text)
        console.log(weatherList)
        return bot.sendMessage(chatId, weatherList)
    })
}

start();