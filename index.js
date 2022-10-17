require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')
const controllers = require('./controllers/index')
const fetch = require("node-fetch");
const db = require('./ext/db')
const User = require('./models/User')

const token = process.env.TELEGRAM_TOKEN

const bot = new TelegramApi(token, {polling: true})

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: "start!"},
         {command: '/weatherfornow', description: "Weather for now!"},
        {command: '/weatherforrivedays', description: "Weather for five days!"}
    ])

    bot.on('message', async msg =>{
        const text = msg.text
        const chatId = msg.chat.id

        if(text === '/start') {
            const candidate = await User.findOne({chatId})
            if(!candidate){
                const user = new User({
                    chatId: chatId

                })
                user.save();

            }
            return await bot.sendMessage(chatId, 'Welcome!')
        }else
            if(text[0]!=='/'){
                const user = await User.findOne({chatId})
                if(!user){
                    return await bot.sendMessage(chatId,'error')
                }
                await  User.updateOne({chatId: chatId}, {cityName: text})
                user.save()
                return await bot.sendMessage(chatId,`Default city changed to ${text}!`)
            }else
                if(text==='/weatherforrivedays'){
                    const user = await User.findOne({chatId})
                    if(!user){
                       return console.log(`can't find the user`)
                    }

                    const weatherList = await controllers.weatherForFiveDays(user.cityName)
                    await bot.sendMessage(chatId, `Weather for ${user.cityName}`)
                    for(let i = 0; i < weatherList.length; i++){
                        await bot.sendMessage(chatId, weatherList[i])
                     }
                    return console.log(`done!`);
                }else
                    if(text==='/weatherfornow'){
                        const user = await User.findOne({chatId})
                        if(!user){
                            return console.log(`can't find the user`)
                        }
                        const weatherList = await controllers.weatherForNow(user.cityName)
                        await bot.sendMessage(chatId, `Weather for ${user.cityName}`)
                        return await bot.sendMessage(chatId, weatherList)
                    }else{
                       return await bot.sendMessage(chatId, 'Unknown command!')
                    }
    return await bot.sendMessage(chatId, '❔')

    })
}

start();