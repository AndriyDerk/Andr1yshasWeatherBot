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

    const maxDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    const options = { month: 'long'};
    let day = date.getDate() + numDay,
        month = new Intl.DateTimeFormat('en-US', options).format(date)
    if(month == 2 && day > 29 &&((date.getFullYear()%4==0) || (date.getFullYear()%4==0 && date.getFullYear()%100)))
        day-=29
    if(day > maxDate[month])day-=maxDate[month]

    return `${day} ${month}`
}

const menuButtons = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: `Current weather`, callback_data: `0-0`}],
            [{text: 'More weather', callback_data: `0-1`}],
            [{text: `Info`, callback_data: `0-2`}]
        ]
    })
}

const weatherButtons = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: `${getDate(0)}`, callback_data: `1-0`}],
            [{text: `${getDate(1)}`, callback_data: `1-1`},
                {text: `${getDate(2)}`, callback_data: `1-2`}],
            [{text: `${getDate(3)}`, callback_data: `1-3`},
                {text: `${getDate(4)}`, callback_data: `1-4`}]
        ]
    })
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: "Start"},
        {command: '/menu', description: "Menu"}
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
            return bot.sendMessage(chatId, 'Menu:', menuButtons)
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
        if(text=='/menu'){
            return bot.sendMessage(chatId, 'Menu:', menuButtons)
        }else                     {
            return await bot.sendMessage(chatId, 'Unknown command!')
        }
        return await bot.sendMessage(chatId, '❔')

    })

    bot.on('callback_query', async msg =>{
        const chatId = msg.from.id
        const info = [ msg.data.slice(0,1), msg.data.slice(2)];

        switch (info[0]){
            case '0':
                switch (info[1]){
                    case '0':// Current weather
                        const user = await User.findOne({chatId})
                        if(!user){
                            await bot.sendMessage(chatId, "Something went wrong")
                            return console.log(`can't find the user`)
                        }
                        const weatherList = await controllers.weatherForNow(user.cityName)
                        await bot.sendMessage(chatId, `Weather for ${user.cityName}`)
                        return await bot.sendMessage(chatId, weatherList)
                    case '1':// -> form for 5 days weather
                        return await bot.sendMessage(chatId, "Choose a date:", weatherButtons)
                    case '2':
                        return await bot.sendMessage(chatId, 'Info:\n\n* To select your city just enter name in chat\n\n* "Current weather" - command which returns a current weather\n\n* "More weather" - command which returns form to choose necessary weather`s date')
                    default:
                        return await bot.sendMessage(chatId, "Something went wrong")
                }
            case '1':// 5 days weather
                const user = await User.findOne({chatId})
                if(!user){
                    await bot.sendMessage(chatId, "Something went wrong")
                    return console.log(`Can't find the user`)
                }

                const weatherList = await controllers.weatherForFiveDays(user.cityName)
                await bot.sendMessage(chatId, `Weather for ${user.cityName}`)
                return await bot.sendMessage(chatId, weatherList[info[1]])
        }


    })

}

start();