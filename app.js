const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

const locationRoutes = require('./routes/locations')

const app = express()

mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB is Connected')).catch(err => console.log(err))

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

app.use('/api/v1', locationRoutes)

const port = process.env.PORT || 2000

app.listen(port, ()=>{
    console.log(`Servr running on PORT: ${port}`)
})



