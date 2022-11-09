const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
// import cookieSession from 'cookie-session'
const app = express()
dotenv.config()

// app.use(cookieSession({
//     name: "session",
//     keys: [""]
// }))


app.use(cors({
    origin: process.env.LOCAL_CLIENT,
    credentials: true
}))

//parser for request bodies
app.use(bodyParser.json())
//controllers
app.use('/user_auth', require('./routes/user_auth'))
app.use('/inventory', require('./routes/inventory'))
app.use('/user_orders', require('./routes/user_orders'))

app.get('/', async (req, res)=>{
    try{
        res.send('Home')
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})

app.listen(process.env.PORT, ()=>{
    console.log(`Listening on ${process.env.PORT}`)
})