const db = require('../ext/db')

const schema = new db.Schema({
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    cityName: {
        type: String,
        default: 'Kyiv'
    }
})

module.exports = db.model('User', schema)