import express from 'express'
import dotenv from 'dotenv'

const app = express()

dotenv.config()

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