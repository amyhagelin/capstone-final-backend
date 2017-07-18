const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    date: { type: Date, required: true },
    time: { type: String },
    type: { type: String },
    triggers: { type: String },
    location: { type: String },
    medication: { type: String },
    notes: { type: String },
    userId: { type: Schema.Types.ObjectId }
})

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;