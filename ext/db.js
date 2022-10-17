const db = require('mongoose')

const uri = 'mongodb+srv://admin:admin@cluster0.f3aoak3.mongodb.net/?retryWrites=true&w=majority'

async function connect(){
    try{
        await db.connect(uri)
        console.log("Connected to MongeDB")
    }catch (error){
        console.log(`dffd`)
    }
}

connect();

module.exports = db;