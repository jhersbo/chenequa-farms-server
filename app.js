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
const corsConfig = {
    origin: "http://localhost:3001",
    credentials: true
}

app.use(cors(corsConfig))

//parser for request bodies
app.use(bodyParser.json())

//CSP headers
app.use((req, res, next)=>{
    res.setHeader(
        "Content-Security-Policy-Report-Only",
        "default-src 'self';"
    );
    next();
})

//controllers
app.use('/user_auth', require('./routes/user_auth'))
app.use('/inventory', require('./routes/inventory'))
app.use('/user_orders', require('./routes/user_orders'))
app.use('/subscriptions', require('./routes/subscriptions'))
app.use('/categories', require('./routes/categories'))
app.use('/sub_types', require('./routes/sub_types'))

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
    console.log(`\nLaunching <-${process.env.NODE_ENV.toUpperCase()}-> environment...\n`)
    console.log(`Listening on ${process.env.PORT}\n`)
})