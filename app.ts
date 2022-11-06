import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
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