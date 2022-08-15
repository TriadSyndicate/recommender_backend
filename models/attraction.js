const mongoose = require('mongoose')

const attractionSchema = new mongoose.Schema({
    attractionID: { type: String, trim: true, require: true },
    geoID: { type: String, trim: true, require: true },
    data: { type: Map, required: true }
})

module.exports = mongoose.model('Attraction', attractionSchema)