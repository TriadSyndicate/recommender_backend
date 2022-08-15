const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    //Location Name
    name: { type: String, trim: true, require: true },
    // Travel Advisor API GeoCode
    geoID: { type: String, trim: true },
    // Array of attractions within this geo location
    attractions: { type: Array, required: false }
})

module.exports = mongoose.model("Location", locationSchema);