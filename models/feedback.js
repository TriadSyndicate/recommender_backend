const mongoose = require('mongoose')
const feedbackSchema = new mongoose.Schema({
    // Firebase user Identifier
    uid: { type: String, trim: true, require: true },
    //Attraction Identifier
    attractionID: { type: String, trim: true, require: true },
    //Positive or Negative feedback of Attraction
    emote: { type: Boolean, require: true },
    // Review of Attraction
    feedback: { type: String, trim: true, require: true }
})

module.exports = mongoose.model('Feedback', feedbackSchema)