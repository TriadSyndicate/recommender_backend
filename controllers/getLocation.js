const axios = require('axios')
const Location = require('../models/location')
const Attraction = require('../models/attraction')
require('dotenv').config()
const rapidapiHeaders = {
    "headers": {
        "X-RapidAPI-Key": process.env.RapidAPIKey,
        "X-RapidAPI-Host": process.env.RapidAPIHost,
        "Content-Type": "application/json"
    }
}
exports.locationById = (req, res, next, id) => {
    Location.findById(id).exec((err, location) => {
        if (err || !location) {
            return res.json({
                error: 'Location not Found'
            })
        }
        //req.profile = location
        next()
    })
}

exports.getLocationByName = (req, res, next) => {
    var name = ''
    var geoId = ''
    axios.post('https://travel-advisor.p.rapidapi.com/locations/v2/search', {
        "query": req.body.locationName
    }, rapidapiHeaders).then((rest) => {
        let sectionsArray = rest.data.data.AppPresentation_queryAppSearch.sections
        sectionsArray.forEach(e => {
            if (e.__typename === 'AppPresentation_SingleCard') {
                if (typeof e.singleCardContent.saveId !== 'undefined' && e.singleCardContent.saveId.type == 'location') {
                    geoId = e.singleCardContent.saveId.id
                    name = e.singleCardContent.cardTitle.string
                    req.geoLocation = { geoId, name }
                    next()
                }
            }
        })
    }).catch((err) => {
        console.log(err)
    })
}

exports.respondLocation = (req, res) => {
    res.json({
        response: req.geoLocation
    })
}


exports.getAttractionsAndStore = (req, res) => {
    var location = { name: req.body.name, geoId: req.body.geoId }
    getLocationIfExists(location).then((locationExists) => {
        if (locationExists === null) {
            getAttractionList(req.body.geoId).then((attractions) => {
                var itemProcessed = 0
                var itemTotal = attractions.length
                for (let i = 0; i < attractions.length; i++) {
                    var e = attractions[i]
                    saveAttraction(e, req.body.geoId).then((ss) => {
                        itemProcessed++
                    })
                }
                saveLocation(location, res)
            })
        } else {
            return res.json({
                exists: locationExists
            })
        }
    })

}

exports.requestValidator = (req, res, next) => {
    const { validationResult } = require('express-validator')

    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}

exports.attractionById = (req, res, next, id) => {
    Attraction.findById(id).exec((err, att) => {
        if (err || !att) {
            return res.status(400).json({
                error: 'Attraction Not Found'
            })
        }
        req.attraction = att
        next()
    })
}

exports.getCategoriesFromAttractionArray = (req, res) => {
    var attractionsArr = req.body.attractions
    let arr = []
    for (let i = 0; i < attractionsArr.length; i++) {
        const e = attractionsArr[i];
        Attraction.findById(e).exec((err, att) => {
            try {
                arr.push(att)
            } catch (error) {
                console.log(error)
            }
        })

        if (i === (attractionsArr.length - 1)) {
            return res.json({
                response: arr
            })
        }
    }
}

async function getAttractionList(geoid) {
    let data = await axios.get(`https://travel-advisor.p.rapidapi.com/attractions/list?location_id=${geoid}&currency=KES&lunit=km&sort=recommended&lang=en_US`, rapidapiHeaders)
    return data.data.data
}

async function saveAttraction(attraction, geoid) {
    const att = new Attraction({
        attractionID: attraction.location_id,
        geoID: geoid,
        data: attraction
    })

    att.save((err, att) => {
        if (att) {
            return att._id
        }
    })
}

async function saveLocation(location, res) {
    const locationx = new Location({
        name: location.name,
        geoID: location.geoId
    })
    locationx.save((err, loc) => {
        if (loc) {
            res.json({
                response: loc
            })

        }
    })
}

async function getLocationIfExists(location) {
    let x = await Location.findOne({ geoID: location.geoId }).exec()
    if (x === null) {
        return x
    } else {
        return await updateLocationWithAttractions(x._id)
    }
}

async function updateLocationWithAttractions(locationDocumentId) {
    const doc = await Location.findById(locationDocumentId)
    const attractionData = await getAttractionsByGeoId(doc.geoID)
    let arr = []
    attractionData.forEach(e => {
        arr.push(e._id)
    })
    if (doc.attractions.length === 0) {
        doc.attractions = arr
        await doc.save()
        return doc
    } else {
        return doc
    }

}

async function getAttractionsByGeoId(geoId) {
    return await Attraction.find({ geoID: geoId }).exec()
}



//  TODO: getLocationSection CardTitle and GeoID

//  TODO: Save GeoID & Attraction Details to MongoDB

//  TODO: GetAttractions Data