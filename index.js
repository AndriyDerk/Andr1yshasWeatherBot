require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')
const controllers = require('./controllers/index')
const fetch = require("node-fetch");
const db = require('./ext/db')
const User = require('./models/User')

const token = process.env.TELEGRAM_TOKEN

const bot = new TelegramApi(token, {polling: true})
const date = new Date();

function getDate(numDay){//TODO: value is over than max date
    const options = { month: 'long'};
    return `${date.getDate() + numDay} ${new Intl.DateTimeFormat('en-US', options).format(date)}`
}

const buttons = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: `${getDate(0)}`, callback_data: `5-0`}],
            [{text: `${getDate(1)}`, callback_data: `5-1`},
            {text: `${getDate(2)}`, callback_data: `5-2`}],
            [{text: `${getDate(3)}`, callback_data: `5-3`},
            {text: `${getDate(4)}`, callback_data: `5-4`}]
        ]
    })
}

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
                    return bot.sendMessage(chatId, "Choose a date", buttons)
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

    bot.on('callback_query', async msg =>{
        //console.log(msg)

        const chatId = msg.from.id
         console.log(msg.data.slice(2))
        //  bot.sendMessage(chatId, "13")
        const info = msg.data.slice(0,1)
        if(info === '5'){
            const user = await User.findOne({chatId})
            if(!user){
                return console.log(`can't find the user`)
            }

            const weatherList = await controllers.weatherForFiveDays(user.cityName)
            await bot.sendMessage(chatId, `Weather for ${user.cityName}`)
            return await bot.sendMessage(chatId, weatherList[msg.data.slice(2)])
        }
    })

}

start();

